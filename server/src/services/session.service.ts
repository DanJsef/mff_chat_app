import { randomBytes } from "crypto";
import sessionModel from "../models/session.model";
import { Session } from "../types/types";
import { cookieParser } from "../utils/parsers";

class SessionService {
  public async createSession(userId: number) {
    let sessionId: string = randomBytes(16).toString("hex");
    const session: Session = { session_id: sessionId, user_id: userId };

    sessionModel.create(session);
    return sessionId;
  }
  public async isValidSession(cookies: string): Promise<boolean> {
    const session = await this.getSession(cookies);
    if (session) return true;
    return false;
  }
  public destroySession(sessionId: string) {
    sessionModel.remove(sessionId);
  }

  public async getSession(cookies: string): Promise<Session> {
    const parsedCookies = cookieParser(cookies);
    const session: Session = await sessionModel.findById(
      parsedCookies.SessionId
    );
    return session;
  }
}

export default new SessionService();
