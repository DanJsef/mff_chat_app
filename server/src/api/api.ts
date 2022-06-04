import { IncomingMessage, ServerResponse } from "http";
import router from "./routes";

const apiPrefix: RegExp = /^\/api\/*/g;

function routeIsApi(url: string): boolean {
  return url.match(apiPrefix) ? true : false;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", `${process.env.CLIENT_ADDRESS}`);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method == "OPTIONS") res.end();
  else if (routeIsApi(req.url)) {
    await router(req, res);
    if (!res.writableFinished) {
      res.statusCode = 404;
      res.end("invalid api request");
    }
  } else {
    res.statusCode = 404;
    res.end("invalid route");
  }
};
