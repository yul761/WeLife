import React, { Component } from "react";
import Header from "./components/header";
import "./styles/main.css";
import Community from "./components/Community";
import { Route, Switch, Redirect } from "react-router-dom";
import gif from "./components/gifGenerate";

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Redirect from="/" to="/community" />
        <Switch>
          <Route path="/community" component={Community} />
          <Route path="/gif" component={gif} />
        </Switch>
      </div>
    );
  }
}
