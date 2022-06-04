import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { apiAddress } from "../utils/constants";
import Validator from "../utils/validator";

interface Props extends RouteComponentProps {}
interface State {
  username: string;
  password: string;
  confirmPassword: string;
  usernameError: string;
  passwordError: string;
  confirmPasswordError: string;
  success: boolean;
}

class SignUpPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      usernameError: "",
      passwordError: "",
      confirmPasswordError: "",
      success: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  validate(type: string) {
    if (type === "username")
      this.setState({
        usernameError: Validator.validateUsername(this.state.username),
      });
    else if (type === "password")
      this.setState({
        passwordError: Validator.validatePassword(this.state.password),
        confirmPasswordError: Validator.validateConfirmPassword(
          this.state.password,
          this.state.confirmPassword
        ),
      });
    else if (type === "confirmPassword")
      this.setState({
        confirmPasswordError: Validator.validateConfirmPassword(
          this.state.password,
          this.state.confirmPassword
        ),
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

  signUp() {
    const data = {
      username: this.state.username,
      password: this.state.password,
    };

    fetch(`${apiAddress}signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) return response.json();
        else {
          this.setState(() => {
            return { success: true };
          });
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
    this.signUp();
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
            <div className="mb-3">
              <label className="form-label">Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                className={`form-control
                ${this.state.confirmPasswordError !== "" ? "is-invalid" : ""}
              `}
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                required
              />
              <div className="invalid-feedback">
                {this.state.confirmPasswordError}
              </div>
            </div>
            <div
              className={`alert alert-success text-center ${
                this.state.success ? "" : "d-none"
              }`}
              role="alert"
            >
              Account created.{" "}
              <Link className="text-success" to="/signIn">
                SignIn here
              </Link>
            </div>
            <div className="">
              <button
                className="btn btn-primary w-100"
                type="submit"
                onClick={this.handleSubmit}
                disabled={
                  !this.state.username ||
                  !this.state.password ||
                  !this.state.confirmPassword ||
                  !!this.state.usernameError ||
                  !!this.state.passwordError ||
                  !!this.state.confirmPasswordError
                }
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <hr />
        <div className="row text-center">
          <Link to="/signIn" className="text-decoration-none">
            Already have an account?
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(SignUpPage);
