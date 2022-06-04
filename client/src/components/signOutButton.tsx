import React from "react";
import { useHistory } from "react-router-dom";
import { apiAddress } from "../utils/constants";

export default function SignOutButton() {
  let history = useHistory();

  function signOut(e: React.MouseEvent) {
    e.preventDefault();
    fetch(`${apiAddress}signOut`, {
      credentials: "include",
    }).then(() => {
      history.push("/signIn");
    });
  }

  return (
    <button className="btn btn-primary" onClick={signOut}>
      Sign Out
    </button>
  );
}
