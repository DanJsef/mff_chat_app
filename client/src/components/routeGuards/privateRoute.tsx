import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { apiAddress } from "../../utils/constants";

interface Props extends RouteProps {}
interface State {
  loading: boolean;
  signedIn: boolean;
}

class PrivateRoute extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { loading: true, signedIn: false };
  }

  isSignedIn() {
    fetch(`${apiAddress}verify`, {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok)
          this.setState(() => {
            return { signedIn: true };
          });
      })
      .then(() => {
        this.setState(() => {
          return { loading: false };
        });
      });
  }

  componentDidMount() {
    this.isSignedIn();
  }

  render() {
    if (this.state.loading) return null;
    return this.state.signedIn ? (
      <Route {...this.props}></Route>
    ) : (
      <Redirect to="/signIn" />
    );
  }
}

export default PrivateRoute;
