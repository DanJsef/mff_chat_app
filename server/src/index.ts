import * as http from "http";
import router from "./api/api";
import * as net from "net";
import WebsocketServer from "./websocket/websocketServer";

const server: http.Server = http.createServer();
const websocketServer = new WebsocketServer();

server.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
  router(req, res);
});

server.on("upgrade", async (req: http.IncomingMessage, socket: net.Socket) => {
  await websocketServer.initConnection(req, socket);
});

server.listen(3001);
