import React, { Component } from "react";
import Images from "../assets/images/video-list-0.jpg";

export default class PostSection extends Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  imgOrvideo = element => {
    if (element.image) {
      return (
        <img className="PostSection__content-img" src={element.image}></img>
      );
    } else if (element.video) {
      return (
        <video
          autoPlay
          loop
          muted
          className="PostSection__content-video"
          src={element.video}
        ></video>
      );
    }
  };

  outputContent = () => {
    if (this.props.post.length === 0) {
      return "Loading ...";
    } else {
      return this.props.post.map((element, index) => {
        return (
          <div className="PostSection__content" key={index}>
            {this.imgOrvideo(element)}

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
