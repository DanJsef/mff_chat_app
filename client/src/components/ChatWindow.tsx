import React from "react";

interface State {}
interface Props {
  chats: { [friendshipId: number]: Array<any> };
  current: number;
  user: number;
  loadReplies: Function;
}

class ChatWindow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
  }
  windowRef = React.createRef<HTMLDivElement>();
  startRef = React.createRef<HTMLDivElement>();
  endRef = React.createRef<HTMLDivElement>();
  jump = false;

  handleScroll(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        if (
          this.props.current !== 0 &&
          !(this.props.chats[this.props.current].length < 5)
        ) {
          this.jump = false;
          this.props.loadReplies();
        }
      }
    });
  }

  observer = new IntersectionObserver(this.handleScroll.bind(this), {
    root: null,
    rootMargin: "20px",
    threshold: 0.5,
  });

  componentDidMount() {
    if (this.startRef.current) {
      this.observer.observe(this.startRef.current);
    }
  }

  componentDidUpdate() {
    if (this.jump && this.windowRef.current)
      this.windowRef.current.scrollTop = 0;
    this.jump = true;
  }

  listMessages() {
    if (this.props.chats[this.props.current])
      return this.props.chats[this.props.current].map((reply: any) => {
        const date = new Date(reply.date);
        return (
          <div
            key={reply.reply_id}
            className={`d-flex m-3 ${
              reply.sender_id === this.props.user ? "justify-content-end" : ""
            }`}
          >
            <div
              className={`d-flex w-50 ${
                reply.sender_id === this.props.user ? "justify-content-end" : ""
              }`}
            >
              <div className="d-flex flex-column">
                <div
                  className={` border rounded p-2 d-inline-block mw-50 break-word ${
                    reply.sender_id === this.props.user
                      ? "bg-info"
                      : "bg-secondary"
                  }`}
                >
                  {reply.text}
                </div>
                <small
                  className={
                    reply.sender_id === this.props.user ? "text-right" : ""
                  }
                >
                  {date.getHours()}:{date.getMinutes()} -{" "}
                  {date.toLocaleDateString("cs-CZ")}
                </small>
              </div>
            </div>
          </div>
        );
      });
  }
  render() {
    return (
      <div
        ref={this.windowRef}
        className="h-100 overflow-auto border rounded d-flex flex-column-reverse"
      >
        <div>
          <div className="m-5" ref={this.startRef}></div>
          {this.listMessages()}
          <div ref={this.endRef} />
        </div>
      </div>
    );
  }
}

export default ChatWindow;
