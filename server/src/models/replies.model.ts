import { Reply } from "../types/types";
import db from "./db";

class RepliesModel {
  get(friendshipId: number, limit: number, offset: number): Promise<Reply[]> {
    return new Promise((resolve) => {
      db.query(
        `SELECT * FROM (SELECT * FROM replies WHERE friendship_id = '${friendshipId}' ORDER BY reply_id DESC LIMIT ${limit} OFFSET ${offset}) AS a ORDER BY reply_id ASC`,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }

  getLast(friendshipId: number): Promise<Reply> {
    return new Promise((resolve) => {
      db.query(
        `SELECT reply_id, friendship_id, sender_id, text, date FROM replies WHERE reply_id = (SELECT MAX(reply_id) FROM replies WHERE friendship_id = '${friendshipId}')`,
        (error, result) => {
          resolve(result[0]);
        }
      );
    });
  }

  getLatest(userId: number): Promise<Reply[]> {
    return new Promise((resolve) => {
      db.query(
        `SELECT reply_id, friendship_id, sender_id, text, date FROM replies WHERE friendship_id IN (SELECT friendship_id from friendships WHERE first_user_id = ${userId} OR second_user_id = ${userId}) AND reply_id IN (SELECT MAX(reply_id) FROM replies GROUP BY friendship_id)`,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }

  create(friendshipId: number, senderId: number, text: string): Promise<void> {
    return new Promise((resolve) => {
      db.query(
        `INSERT INTO replies (friendship_id, sender_id,text, date) VALUES ('${friendshipId}', ${senderId}, '${text}', CURRENT_TIMESTAMP)`,
        () => resolve()
      );
    });
  }
}
export default new RepliesModel();
