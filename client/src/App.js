import React, { Component } from "react";
import Header from "./components/header";
import "./styles/main.css";
import Community from "./components/Community";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import gif from "./components/gifGenerate";

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Header current={this.props.location.pathname} />
        <Redirect from="/" to="/community" />
        <Switch>
          <Route path="/community" component={Community} />
          <Route path="/gif" component={gif} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
