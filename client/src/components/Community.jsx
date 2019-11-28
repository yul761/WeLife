import React, { Component } from "react";
import AddComment from "./AddComment";
import PostSection from "./PostSection";

export default class Community extends Component {
  render() {
    return (
      <div className="community">
        <PostSection />
        <AddComment />
      </div>
    );
  }
}
