import React, { Component } from "react";
import Images from "../assets/images/video-list-0.jpg";

export default class PostSection extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  outputContent = () => {
    console.log("this is here ");
    console.log(this.props.post);
    if (this.props.post.length === 0) {
      console.log("if loading");
      return "Loading ...";
    } else {
      console.log("if done loading");
      console.log(this.props.post);
      return this.props.post.map((element, index) => {
        console.log(element);
        return (
          <div className="PostSection__content" key={index}>
            <video
              className="PostSection__content-video"
              poster={element.image}
            ></video>

            <div className="PostSection__content-comment">
              {element.comment}
            </div>
            <div className="PostSection__content-name">{element.name}</div>
          </div>
        );
      });
    }
  };

  render() {
    return <div className="PostSection">{this.outputContent()}</div>;
  }
}
