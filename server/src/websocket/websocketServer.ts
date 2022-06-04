import { createHash, randomBytes } from "crypto";
import { IncomingMessage } from "http";
import { Socket } from "net";
import commService from "../services/comm.service";
import sessionService from "../services/session.service";
import { Session, SocketComm } from "../types/types";

interface WebSocket extends Socket {
  userId?: number;
  deviceId?: string;
}

interface ParsedBufferProps {
  remainingBuffer: Buffer;
  final?: boolean;
  payload?: string;
}

interface ConnectionPool {
  [userId: number]: {
    count: number;
    devices: { [deviceId: string]: WebSocket };
  };
}

class WebsocketServer {
  connectionPool: ConnectionPool = {};

  public async initConnection(req: IncomingMessage, socket: WebSocket) {
    const cookies = req.headers.cookie;
    const isAuthenticated: boolean = await sessionService.isValidSession(
      cookies
    );

    if (req.headers.upgrade == "websocket" && isAuthenticated) {
      const key: string = req.headers["sec-websocket-key"];
      const acceptKey: string = this.generateAcceptKey(key);
      const responseHeaders = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: WebSocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptKey}`,
      ];

      socket.write(responseHeaders.join("\r\n") + "\r\n\r\n");

      const session: Session = await sessionService.getSession(cookies);
      socket.userId = session.user_id;
      socket.deviceId = randomBytes(16).toString("hex");

      let remainingBuffer: Buffer = Buffer.alloc(0);
      let payload: string[] = [];
      let finished: boolean = false;

      socket.on("data", async (buffer: Buffer) => {
        remainingBuffer = Buffer.concat([remainingBuffer, buffer]);
        let parsedBuffer: ParsedBufferProps = this.parseBuffer(remainingBuffer);

        remainingBuffer = parsedBuffer.remainingBuffer;
        if (parsedBuffer.payload) payload.push(parsedBuffer.payload);
        finished = parsedBuffer.final;

        if (finished && payload.length > 0 && remainingBuffer.length === 0) {
          if (payload.join() === "CONNECTED") {
            this.addConnection(socket);

            const response = await commService.initialData(socket.userId);
            socket.write(this.constructFrame(response));
          } else {
            const response = await commService.dispatcher(
              this.parsePayload(payload),
              socket.userId
            );

            this.sendResponse(response);
          }

          finished = false;
          payload = [];
        } else if (finished && remainingBuffer.length === 0) {
          socket.end();
        }
      });

      socket.on("close", () => {
        this.removeConnection(socket);
      });
    } else socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  }

  private parsePayload(payload: string[]): SocketComm {
    return JSON.parse(payload.join());
  }

  private generateAcceptKey(acceptKey: string): string {
    return createHash("sha1")
      .update(acceptKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")

      .digest("base64");
  }

  private addConnection(socket: WebSocket) {
    if (this.connectionPool[socket.userId]) {
      this.connectionPool[socket.userId].count++;
      this.connectionPool[socket.userId].devices[socket.deviceId] = socket;
    } else {
      this.connectionPool[socket.userId] = {
        count: 1,
        devices: { [socket.deviceId]: socket },
      };
    }
  }

  private removeConnection(socket: WebSocket) {
    if (
      this.connectionPool[socket.userId] &&
      this.connectionPool[socket.userId].devices[socket.deviceId]
    ) {
      if (this.connectionPool[socket.userId].count === 1)
        delete this.connectionPool[socket.userId];
      else {
        delete this.connectionPool[socket.userId].devices[socket.deviceId];
        this.connectionPool[socket.userId].count--;
      }
    }
  }

  private sendResponse(response: SocketComm) {
    if (response.to) this.sendToUser(response.to, response);
    if (response.pingBack) this.sendToUser(response.from, response);
  }

  private sendToUser(userId: number, response: SocketComm) {
    if (this.connectionPool[userId])
      for (const device in this.connectionPool[userId].devices)
        if (this.connectionPool[userId].devices[device].writable)
          this.connectionPool[userId].devices[device].write(
            this.constructFrame(response)
          );
  }

  private parseBuffer(buffer: Buffer): ParsedBufferProps {
    let currentOffset: number = 0;
    let maskKey;

    if (currentOffset + 2 > buffer.length)
      return { remainingBuffer: buffer, final: null, payload: null };

    const firstByte: number = buffer.readUInt8(currentOffset++);
    const secondByte: number = buffer.readUInt8(currentOffset++);
    const opCode: number = firstByte & 0xf;
    const isFinal: boolean = Boolean((firstByte >>> 7) & 0x1);
    const isMasked: boolean = Boolean((secondByte >>> 7) & 0x1);
    let payloadLength: number = secondByte & 0x7f;

    if (opCode !== 0x1) {
      return {
        remainingBuffer: Buffer.alloc(0),
        final: isFinal,
        payload: null,
      };
    }

    if (payloadLength > 125) {
      if (payloadLength === 126) {
        if (currentOffset + 2 > buffer.length) {
          return { remainingBuffer: buffer, final: isFinal, payload: null };
        }

        payloadLength = buffer.readUInt16BE(currentOffset);
        currentOffset += 2;
      } else {
        if (currentOffset + 8 > buffer.length) {
          return { remainingBuffer: buffer, final: isFinal, payload: null };
        }

        const leftPart = buffer.readUInt32BE(currentOffset);
        const rightPart = buffer.readUInt32BE((currentOffset += 4));

        payloadLength = (leftPart << 32) | rightPart;
        currentOffset += 4;
      }
    }

    if (isMasked) {
      if (currentOffset + 4 > buffer.length) {
        return { remainingBuffer: buffer, final: isFinal, payload: null };
      }

      maskKey = buffer.readUInt32BE(currentOffset);
      currentOffset += 4;
    }

    if (currentOffset + payloadLength > buffer.length) {
      return { remainingBuffer: buffer, final: isFinal, payload: null };
    }

    const data: Buffer = Buffer.alloc(payloadLength);
    if (isMasked) {
      for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
        const shift = j == 3 ? 0 : (3 - j) << 3;
        const mask = (shift == 0 ? maskKey : maskKey >>> shift) & 0xff;
        const source = buffer.readUInt8(currentOffset++);
        data.writeUInt8(mask ^ source, i);
      }
    } else {
      for (let i = 0; i < payloadLength; ++i) {
        const source = buffer.readUInt8(currentOffset++);
        data.writeUInt8(source, i);
      }
    }

    let remainingBuffer: Buffer = Buffer.alloc(buffer.length - currentOffset);
    for (let i = 0; i < remainingBuffer.length; i++) {
      remainingBuffer.writeUInt8(buffer.readUInt8(currentOffset++), i);
    }

    return {
      remainingBuffer: Buffer.alloc(0),
      final: isFinal,
      payload: data.toString("utf8"),
    };
  }

  private constructFrame(data: SocketComm): Buffer {
    const payload: string = JSON.stringify(data);
    const extendedPayloadLength: number = Buffer.byteLength(payload);
    const lengthOffset: number =
      extendedPayloadLength < 126 ? 0 : extendedPayloadLength < 65536 ? 2 : 8;
    const payloadLength: number =
      lengthOffset === 0
        ? extendedPayloadLength
        : lengthOffset === 2
        ? 126
        : 127;
    const buffer = Buffer.alloc(2 + lengthOffset + extendedPayloadLength);

    buffer.writeUInt8(0b10000001, 0);
    buffer.writeUInt8(payloadLength, 1);

    let payloadOffset = 2;

    if (lengthOffset === 2) {
      buffer.writeUInt16BE(extendedPayloadLength, payloadOffset);
      payloadOffset += lengthOffset;
    } else if (lengthOffset === 8) {
      buffer.writeUInt32BE(extendedPayloadLength >> 31, payloadOffset);
      buffer.writeUInt32BE(extendedPayloadLength, payloadOffset + 4);
      payloadOffset += lengthOffset;
    }

    buffer.write(payload, payloadOffset);
    return buffer;
  }
}

export default WebsocketServer;
