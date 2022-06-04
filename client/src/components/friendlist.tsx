import React from "react";

interface State {}
interface Props {
  friendlist: [];
  switchChat: Function;
  chats: { [friendshipId: number]: Array<any> };
  current: number;
}

class Friendlist extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.listFriends = this.listFriends.bind(this);
  }

  listFriends() {
    return this.props.friendlist.map((friend: any) => {
      const lastReply =
        this.props.chats[friend.friendship_id][
          this.props.chats[friend.friendship_id].length - 1
        ];
      return (
        <span
          key={friend.user_id}
          className={`list-group-item list-group-item-action clickable ${
            this.props.current === friend.friendship_id ? "active" : ""
          }`}
          onClick={() =>
            this.props.switchChat(friend.friendship_id, friend.user_id)
          }
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{friend.username}</h5>
            <small>
              {new Date(lastReply.date).toLocaleDateString("cs-CZ")}
            </small>
          </div>
          <p className="mb-1 text-truncate">{lastReply.text}</p>
        </span>
      );
    });
  }

  render() {
    return (
      <div className="p-0 h-100 border rounded overflow-auto">
        {this.listFriends()}
      </div>
    );
  }
}

export default Friendlist;
