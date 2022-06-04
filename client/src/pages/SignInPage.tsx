import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { apiAddress } from "../utils/constants";
import Validator from "../utils/validator";

interface Props extends RouteComponentProps {}
interface State {
  username: string;
  password: string;
  usernameError: string;
  passwordError: string;
}

class SignInPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      usernameError: "",
      passwordError: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
  }

  validate(type: string) {
    if (type === "username")
      this.setState({
        usernameError: Validator.validateUsername(this.state.username),
      });
    else if (type === "password")
      this.setState({
        passwordError: Validator.validatePassword(this.state.password),
      });
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState(
      {
        ...this.state,
        [e.target.name]: e.target.value,
      },
      () => {
        this.validate(e.target.name);
      }
    );
  }

  login() {
    const data = {
      username: this.state.username,
      password: this.state.password,
    };

    fetch(`${apiAddress}signIn`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) return response.json();
        else {
          this.props.history.push("/");
        }
      })
      .then((data) => {
        if (data) {
          this.setState(() => {
            return { ...this.state, [data.name]: data.message };
          });
        }
      });
  }

  handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    this.login();
  }

  render() {
    return (
      <div className="container d-flex flex-column vh-100 align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <form className="col col-lg-6 col-xl-4 col-10">
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className={`form-control
                ${this.state.usernameError !== "" ? "is-invalid" : ""}
              `}
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
              <div className="invalid-feedback">{this.state.usernameError}</div>
            </div>
            <div className="mb-3">
              <label className="form-label">Passowrd</label>
              <input
                name="password"
                type="password"
                className={`form-control
                ${this.state.passwordError !== "" ? "is-invalid" : ""}
              `}
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
              <div className="invalid-feedback">{this.state.passwordError}</div>
            </div>
            <div className="">
              <button
                className="btn btn-primary w-100"
                type="submit"
                onClick={this.handleSubmit}
                disabled={
                  !this.state.username ||
                  !this.state.password ||
                  !!this.state.passwordError ||
                  !!this.state.usernameError
                }
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
        <hr />
        <div className="row text-center">
          <Link to="/signUp" className="text-decoration-none">
            Create new account
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(SignInPage);
