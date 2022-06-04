import { FriendRequest, User } from "../types/types";
import db from "./db";

class FriendrequestModel {
  findById(requestId: number): Promise<FriendRequest> {
    return new Promise((resolve) => {
      db.query(
        `SELECT * FROM friendrequests WHERE request_id = '${requestId}'`,
        (error, result) => {
          resolve(result[0]);
        }
      );
    });
  }

  findByUsers(
    firstUserId: number,
    secondUserId: number
  ): Promise<FriendRequest> {
    return new Promise((resolve) => {
      db.query(
        `SELECT * FROM friendrequests WHERE from_user IN ('${firstUserId}', '${secondUserId}') AND to_user IN ('${firstUserId}', '${secondUserId}')`,
        (error, result) => {
          resolve(result[0]);
        }
      );
    });
  }

  create(from: number, to: number): Promise<void> {
    return new Promise((resolve) => {
      db.query(
        `INSERT INTO friendrequests (from_user,to_user) VALUES ('${from}','${to}')`,
        () => resolve()
      );
    });
  }

  remove(requestId: number): Promise<void> {
    return new Promise((resolve) => {
      db.query(
        `DELETE FROM friendrequests WHERE request_id = '${requestId}'`,
        () => resolve()
      );
    });
  }

  getRequests(userId: number): Promise<User[]> {
    return new Promise((resolve) => {
      db.query(
        `SELECT friendrequests.request_id, users.username, users.user_id FROM friendrequests INNER JOIN users ON friendrequests.from_user=users.user_id WHERE friendrequests.to_user = '${userId}'`,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }
}

export default new FriendrequestModel();
