import React from "react";

interface State {
  open: boolean;
  username: string;
}
interface Props {
  requests: [];
  friends: [];
  refuse: Function;
  sendRequest: Function;
  accept: Function;
  remove: Function;
}

class FriendManager extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { username: "", open: false };

    this.toggleManager = this.toggleManager.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  toggleManager() {
    this.setState((prevState) => ({ open: !prevState.open }));
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value });
  }

  sendRequest(e: React.MouseEvent) {
    e.preventDefault();
    this.setState({ username: "" });
    this.props.sendRequest(this.state.username);
  }

  renderRequests() {
    if (this.props.requests) {
      return this.props.requests.map((request: any) => {
        return (
          <div
            key={request.request_id}
            className="w-100 d-flex border-top border-bottom p-1 align-items-center"
          >
            <div className="w-100">{request.username}</div>
            <button
              onClick={() =>
                this.props.accept(request.request_id, request.user_id)
              }
              className="btn btn-success m-2 mt-0 mb-0"
            >
              <i className="bi bi-check-lg"></i>
            </button>
            <button
              onClick={() => this.props.refuse(request.request_id)}
              className="btn btn-danger"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        );
      });
    }
  }

  renderRemoves() {
    if (this.props.friends) {
      return this.props.friends.map((friend: any) => {
        return (
          <div
            key={friend.user_id}
            className="w-100 d-flex border-top border-bottom p-1 align-items-center"
          >
            <div className="w-100">{friend.username}</div>
            <button
              onClick={() =>
                this.props.remove(friend.friendship_id, friend.user_id)
              }
              className="btn btn-danger"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        );
      });
    }
  }

  render() {
    return (
      <div>
        <button
          className="btn btn-primary position-relative"
          type="button"
          onClick={this.toggleManager}
        >
          Manage friends
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {this.props.requests.length}
          </span>
        </button>
        <div
          className={`offcanvas offcanvas-end visible ${
            this.state.open ? "show" : ""
          }`}
          tabIndex={-1}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Friend manager</h5>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={this.toggleManager}
            ></button>
          </div>
          <div className="offcanvas-body">
            <form className="d-flex form-inline">
              <div className="form-group flex-grow-1 mr-5">
                <input
                  name="val"
                  type="text"
                  className="form-control "
                  placeholder="Usename"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary m-2 mr-0 ml-0 mb-0 mt-0"
                onClick={this.sendRequest}
              >
                Add
              </button>
            </form>
            <div className="mt-3">
              <h5>Requests</h5>
              {this.renderRequests()}
            </div>
            <div className="mt-3">
              <h5>Remove friends</h5>
              {this.renderRemoves()}
            </div>
          </div>
        </div>
        <div
          className={`offcanvas-backdrop fade ${
            this.state.open ? "show visible" : "invisible"
          }`}
        ></div>
      </div>
    );
  }
}

export default FriendManager;
