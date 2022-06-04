import friendrequestsModel from "../models/friendrequests.model";
import friendshipsModel from "../models/friendships.model";
import repliesModel from "../models/replies.model";
import userModel from "../models/user.model";
import { FriendRequest, Friendship, User } from "../types/types";

class FriendshipService {
  public async createRequest(
    from: number,
    toUsername: string
  ): Promise<number> {
    try {
      const toUser: User = await userModel.findByUsername(toUsername);
      if (
        !(await friendrequestsModel.findByUsers(from, toUser.user_id)) &&
        from != toUser.user_id &&
        !(await friendshipsModel.findByUsers(from, toUser.user_id))
      ) {
        await friendrequestsModel.create(from, toUser.user_id);
        return toUser.user_id;
      }
    } catch (e) {}
  }

  public async createFriendship(requestId: number): Promise<number> {
    const request: FriendRequest = await friendrequestsModel.findById(
      requestId
    );

    friendrequestsModel.remove(requestId);

    await friendshipsModel.create(request.from_user, request.to_user);
    const friendship: Friendship = await friendshipsModel.findByUsers(
      request.from_user,
      request.to_user
    );

    await repliesModel.create(
      friendship.friendship_id,
      0,
      "You are now friends"
    );
    return request.from_user;
  }
}

export default new FriendshipService();
