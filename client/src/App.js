import React, { Component } from "react";
import Header from "./components/header";
import "./styles/main.css";
import Community from "./components/Community";

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Community />
      </div>
    );
  }
}
