import React from "react";

interface State {
  val: string;
}
interface Props {
  send: Function;
}

class ChatInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { val: "" };

    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ val: e.target.value });
  }

  send(e: React.MouseEvent) {
    e.preventDefault();
    this.setState(() => ({
      val: "",
    }));
    this.props.send(this.state.val);
  }

  render() {
    return (
      <div className="mt-2">
        <form className="d-flex form-inline">
          <div className="form-group flex-grow-1 mr-5">
            <input
              name="val"
              type="text"
              className="form-control "
              placeholder="Type your message"
              value={this.state.val}
              onChange={this.handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary m-2 mr-0 ml-0 mb-0 mt-0"
            onClick={this.send}
          >
            Send message
          </button>
        </form>
      </div>
    );
  }
}

export default ChatInput;
