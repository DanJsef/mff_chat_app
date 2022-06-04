import userModel from "../models/user.model";
import { User } from "../types/types";
import ErrorDescription from "../utils/error";
import { pbkdf2Sync, randomBytes } from "crypto";

class UserService {
  public async createUser(user: User) {
    user.salt = this.generateSalt();
    user.password = this.hashPassword(user.password, user.salt);
    await userModel.create(user);
  }

  public async validateUser(user: User) {
    const userRecord = await userModel.findByUsername(user.username);
    if (!userRecord)
      throw new ErrorDescription(
        "usernameError",
        "Username does not exist",
        400
      );
    const passwordMatch = this.validatePassword(
      user.password,
      userRecord.password,
      userRecord.salt
    );
    if (!passwordMatch)
      throw new ErrorDescription("passwordError", "Password is incorrect", 400);
  }

  private generateSalt(): string {
    return randomBytes(16).toString("hex");
  }

  private hashPassword(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex");
  }

  private validatePassword(
    password: string,
    hashedPassword: string,
    salt: string
  ): boolean {
    return this.hashPassword(password, salt) === hashedPassword ? true : false;
  }
}

export default new UserService();
