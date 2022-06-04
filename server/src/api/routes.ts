import { IncomingMessage, ServerResponse } from "http";
import userModel from "../models/user.model";
import sessionService from "../services/session.service";

import userService from "../services/user.service";
import { User } from "../types/types";
import { apiUrl, cookieParser, requestDataParser } from "../utils/parsers";

export default async (req: IncomingMessage, res: ServerResponse) => {
  const url = apiUrl(req.url);

  switch (url) {
    case "/signIn": {
      let body = await requestDataParser(req);

      try {
        await userService.validateUser(body);

        let userRecord: User = await userModel.findByUsername(body.username);
        const sessionId: string = await sessionService.createSession(
          userRecord.user_id
        );

        res.writeHead(200, {
          "Set-cookie": `SessionId=${sessionId}; HttpOnly; SameSite=strict; Path=/`,
        });
      } catch (e) {
        res.statusCode = e.httpStatusCode;
        res.write(JSON.stringify(e));
      }

      res.end();
      break;
    }
    case "/signUp": {
      let body = await requestDataParser(req);

      try {
        await userService.createUser(body);
      } catch (e) {
        res.statusCode = e.httpStatusCode;
        res.write(JSON.stringify(e));
      }

      res.end();
      break;
    }
    case "/verify": {
      if (await sessionService.isValidSession(req.headers.cookie)) {
        res.statusCode = 200;
      } else res.statusCode = 401;

      res.end();
      break;
    }
    case "/signOut": {
      const cookies: any = cookieParser(req.headers.cookie);

      sessionService.destroySession(cookies.SessionId);

      res.writeHead(200, {
        "Set-cookie": "SessionId=null; HttpOnly; SameSite=strict; Path=/",
      });

      res.end();
      break;
    }
  }
};
