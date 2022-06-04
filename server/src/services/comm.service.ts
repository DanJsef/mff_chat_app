import friendrequestsModel from "../models/friendrequests.model";
import friendshipsModel from "../models/friendships.model";
import repliesModel from "../models/replies.model";
import { SocketComm } from "../types/types";
import friendshipService from "./friendship.service";

class CommService {
  public async dispatcher(
    clientMessage: SocketComm,
    userId: number
  ): Promise<SocketComm> {
    let response: SocketComm = clientMessage;
    response.from = userId;

    switch (response.type) {
      case "friendRequest": {
        const toUserId = await friendshipService.createRequest(
          userId,
          response.content
        );

        if (toUserId) {
          response.friendRequests = await friendrequestsModel.getRequests(
            toUserId
          );

          response.to = toUserId;
        }

        return response;
      }
      case "acceptFriend": {
        response.to = await friendshipService.createFriendship(
          response.content
        );
        response.friendRequests = await friendrequestsModel.getRequests(
          response.from
        );
        response.type = "friendRequest";
        response.refreshFriendlist = true;

        return response;
      }
      case "refuseFriend": {
        await friendrequestsModel.remove(response.content);
        response.friendRequests = await friendrequestsModel.getRequests(
          response.from
        );
        response.type = "friendRequest";
        return response;
      }
      case "removeFriend": {
        await friendshipsModel.remove(response.content);
        response.refreshFriendlist = true;
        return response;
      }
      case "refreshFriendlist": {
        response.friendlist = await friendshipsModel.getFriends(userId);
        response.replies = await repliesModel.getLatest(userId);
        return response;
      }
      case "message": {
        response.content = response.content.replace(/'/g, "\\'");
        await repliesModel.create(
          response.friendship,
          response.from,
          response.content
        );
        response.replies = await repliesModel.getLast(response.friendship);
        return response;
      }
      case "loadReplies": {
        response.replies = await repliesModel.get(
          response.friendship,
          20,
          response.content
        );
        return response;
      }
    }

    return;
  }

  public async initialData(userId: number): Promise<SocketComm> {
    let response: SocketComm = {
      type: "init",
      to: null,
      from: userId,
      pingBack: true,
    };

    response.friendlist = await friendshipsModel.getFriends(userId);
    response.friendRequests = await friendrequestsModel.getRequests(userId);
    response.pingBack = true;
    response.replies = await repliesModel.getLatest(userId);
    return response;
  }
}

export default new CommService();
