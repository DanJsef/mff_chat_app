import { Friendship, User } from "../types/types";
import db from "./db";

class FriendshipModel {
  create(firstUserId: number, secondUserId: number): Promise<void> {
    return new Promise((resolve) => {
      db.query(
        `INSERT INTO friendships (first_user_id,second_user_id) VALUES ('${firstUserId}','${secondUserId}')`,
        () => resolve()
      );
    });
  }

  remove(friendshipId: number): Promise<void> {
    return new Promise((resolve) => {
      db.query(
        `DELETE FROM friendships WHERE friendship_id IN ('${friendshipId}') `,
        () => resolve()
      );
    });
  }

  findByUsers(firstUserId: number, secondUserId: number): Promise<Friendship> {
    return new Promise((resolve) => {
      db.query(
        `SELECT * FROM friendships WHERE first_user_id IN ('${firstUserId}', '${secondUserId}') AND second_user_id IN ('${firstUserId}', '${secondUserId}')`,
        (error, result) => {
          resolve(result[0]);
        }
      );
    });
  }

  getFriends(userId: number): Promise<User[]> {
    return new Promise((resolve) => {
      db.query(
        `SELECT friendships.friendship_id, users.user_id, users.username FROM friendships INNER JOIN users ON CASE WHEN friendships.second_user_id = '${userId}' THEN friendships.first_user_id WHEN friendships.first_user_id = '${userId}' THEN friendships.second_user_id END =users.user_id `,
        (error, result) => {
          resolve(result);
        }
      );
    });
  }
}

export default new FriendshipModel();
