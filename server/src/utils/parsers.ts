import { IncomingMessage } from "http";

export function apiUrl(url: string): string {
  return url.substring("/api".length);
}

export function cookieParser(cookies: string): { [name: string]: string } {
  let parsedCookies: any = {};

  if (cookies == undefined) return parsedCookies;

  const cookieArray: Array<string> = cookies.split("; ");

  cookieArray.forEach((cookie) => {
    let [name, value]: string[] = cookie.split("=");

    parsedCookies[name] = value;
  });
  return parsedCookies;
}

export function requestDataParser(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      let chunks: Array<any> = [];
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });
      req.on("end", () => {
        resolve(JSON.parse(chunks.toString()));
      });
    } catch (error) {
      reject(error);
    }
  });
}
