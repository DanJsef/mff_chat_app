import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import PrivateRoute from "./components/routeGuards/privateRoute";
import AnonymousRoute from "./components/routeGuards/anonymousRoute";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/">
          <HomePage />
        </PrivateRoute>
        <AnonymousRoute path="/signIn">
          <SignInPage />
        </AnonymousRoute>
        <Route path="/signUp">
          <SignUpPage />
        </Route>
        <Route path="*">
          <div>NOT FOUND</div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
