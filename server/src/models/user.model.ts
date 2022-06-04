import db from "./db";
import { User } from "../types/types";
import ErrorDescription from "../utils/error";

class UserModel {
  findById(userId: number): Promise<User> {
    return new Promise((resolve) => {
      db.query(
        `SELECT * FROM users WHERE user_id = ${userId}`,
        (error, result) => {
          resolve(result[0]);
        }
      );
    });
  }

  findByUsername(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          `SELECT * FROM users WHERE username = '${username}'`,
          (error, result) => {
            return resolve(result[0]);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  create(user: User) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (username,password,salt) VALUES ('${user.username}','${user.password}','${user.salt}')`,
        (error, result) => {
          if (error)
            reject(
              new ErrorDescription(
                "usernameError",
                "Username already exists",
                400
              )
            );
          else resolve(result);
        }
      );
    });
  }
}

export default new UserModel();
