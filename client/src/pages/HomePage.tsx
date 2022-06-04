import React from "react";
import SignOutButton from "../components/signOutButton";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Friendlist from "../components/friendlist";
import ChatWindow from "../components/ChatWindow";
import FriendManager from "../components/FriendManager";
import ChatInput from "../components/ChatInput";
import { wsServeAddress } from "../utils/constants";

interface State {
  user: number;
  currentChat: number;
  currentFriend: number;
  chats: any;
  friendlist: any;
  friendRequests: [];
}
interface Props extends RouteComponentProps {}

class HomePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: 0,
      currentChat: 0,
      currentFriend: 0,
      friendlist: [],
      friendRequests: [],
      chats: {},
    };

    this.switchChat = this.switchChat.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.refuseFriendRequest = this.refuseFriendRequest.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
    this.removeFriend = this.removeFriend.bind(this);
    this.loadReplies = this.loadReplies.bind(this);
  }
  ws = new WebSocket(wsServeAddress);

  componentDidMount() {
    this.ws.onopen = () => {
      this.ws.send("CONNECTED");
    };

    this.ws.onmessage = (evt) => {
      let data = JSON.parse(evt.data);
      if (data.refreshFriendlist) {
        this.ws.send(
          JSON.stringify({ type: "refreshFriendlist", pingBack: true })
        );
      }
      switch (data.type) {
        case "init": {
          let chats: { [friendshipId: number]: Array<any> } = {};

          if (data.replies)
            data.replies.forEach((reply: any) => {
              chats[reply.friendship_id] = [reply];
            });

          this.setState({
            friendRequests: data.friendRequests,
            friendlist: data.friendlist,
            chats: chats,
            user: data.from,
          });
          break;
        }
        case "friendRequest": {
          this.setState({ friendRequests: data.friendRequests });
          break;
        }
        case "refreshFriendlist": {
          let chats: { [friendshipId: number]: Array<any> } = {
            ...this.state.chats,
          };

          data.replies.forEach((reply: any) => {
            if (!chats[reply.friendship_id])
              chats[reply.friendship_id] = [reply];
          });

          this.setState({ friendlist: data.friendlist, chats: chats });
          break;
        }
        case "message": {
          let chats = this.state.chats;
          chats[data.friendship].push(data.replies);
          this.setState({ chats: chats });
          break;
        }
        case "loadReplies": {
          let chats = this.state.chats;
          chats[data.friendship] = data.replies.concat(chats[data.friendship]);
          this.setState({ chats: chats });
          break;
        }
      }
    };

    this.ws.onclose = () => {};
  }

  componentWillUnmount() {
    this.ws.close();
  }

  sendRequest(username: string) {
    let data = { type: "friendRequest", content: username, pingBack: false };
    this.ws.send(JSON.stringify(data));
  }

  refuseFriendRequest(requestId: number) {
    let data = { type: "refuseFriend", content: requestId, pingBack: true };
    this.ws.send(JSON.stringify(data));
  }

  acceptFriendRequest(requestId: number, toUserId: number) {
    let data = {
      type: "acceptFriend",
      to: toUserId,
      content: requestId,
      pingBack: true,
    };
    this.ws.send(JSON.stringify(data));
  }
  removeFriend(friendshipId: number, friendId: number) {
    let data = {
      type: "removeFriend",
      to: friendId,
      content: friendshipId,
      pingBack: true,
    };
    this.ws.send(JSON.stringify(data));
  }

  sendMessage(message: string) {
    if (this.state.currentChat !== 0) {
      let data = {
        type: "message",
        to: this.state.currentFriend,
        friendship: this.state.currentChat,
        pingBack: true,
        content: message,
      };
      this.ws.send(JSON.stringify(data));
    }
  }

  loadReplies() {
    if (this.state.currentChat !== 0) {
      let data = {
        type: "loadReplies",
        pingBack: true,
        friendship: this.state.currentChat,
        content: this.state.chats[this.state.currentChat].length,
      };
      this.ws.send(JSON.stringify(data));
    }
  }

  switchChat(friendshipId: number, userId: number) {
    this.setState({ currentChat: friendshipId, currentFriend: userId }, () => {
      if (this.state.chats[this.state.currentChat].length < 2)
        this.loadReplies();
    });
  }

  render() {
    return (
      <div className="w-100 vh-100">
        <div className="row m-0 h-100 p-3">
          <div className="col d-flex flex-column h-100 m-0 p-0">
            <ChatWindow
              loadReplies={this.loadReplies}
              user={this.state.user}
              current={this.state.currentChat}
              chats={this.state.chats}
            />
            <ChatInput send={this.sendMessage} />
          </div>
          <div className="d-flex flex-column col-3 h-100 p-0">
            <div className="d-flex justify-content-between m-2 mr-0 mt-0 mb-0 p-0">
              <FriendManager
                remove={this.removeFriend}
                accept={this.acceptFriendRequest}
                refuse={this.refuseFriendRequest}
                requests={this.state.friendRequests}
                sendRequest={this.sendRequest}
                friends={this.state.friendlist}
              />
              <SignOutButton />
            </div>
            <div className="h-100 m-2 mb-0 mr-0 p-0 overflow-hidden">
              <Friendlist
                current={this.state.currentChat}
                chats={this.state.chats}
                friendlist={this.state.friendlist}
                switchChat={this.switchChat}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
