import { Session } from "../types/types";
import db from "./db";

class SessionModel {
  findById(sessionId: string): Promise<Session> {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM sessions WHERE session_id = '${sessionId}'`,
        (error, result) => {
          if (error) reject(error);
          resolve(result[0]);
        }
      );
    });
  }

  create(session: Session) {
    db.query(
      `INSERT INTO sessions (session_id,user_id) VALUES ('${session.session_id}','${session.user_id}')`
    );
  }

  remove(sessionId: string) {
    db.query(`DELETE FROM sessions WHERE session_id = '${sessionId}'`);
  }
}

export default new SessionModel();
