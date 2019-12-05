import React, { Component } from "react";
import $ from "jquery";
import Menu from "../assets/icon/menu.png";

var IndexSlider = 1;
var flag;

export default class PostSection extends Component {
  constructor() {
    super();
    this.state = { sliderIndex: 1 };
  }

  componentDidMount() {
    flag = false;
    console.log("component did mount");
    // this.showDivs(this.state.sliderIndex);
  }

  componentDidUpdate() {
    console.log("component did update");
    if (flag) {
      this.showDivs(IndexSlider);
    }
  }

  showDivs = n => {
    let i;
    let x = document.getElementsByClassName("PostSection__content");
    if (n > x.length) {
      // this.setState({ sliderIndex: 1 });
      IndexSlider = 1;
    }

    if (n < 1) {
      // this.setState({ sliderIndex: x.length - 1 });
      IndexSlider = x.length;
    }

    for (let i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }

    console.log(x);
    console.log(IndexSlider - 1);
    console.log(x[IndexSlider - 1]);

    x[IndexSlider - 1].style.display = "flex";
  };

  plusDivs = n => {
    this.showDivs((IndexSlider += n));
  };

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
        if (index === this.props.post.length - 1) {
          flag = true;
        }

        return (
          <div className="PostSection__content" key={index}>
            {this.imgOrvideo(element)}

            <div className="PostSection__content-commentSection">
              <div className="PostSection__content-commentSection--userInfo">
                <div className="PostSection__content-commentSection--userInfo--name">
                  {element.name}
                </div>
                <img
                  className="PostSection__content-commentSection--userInfo--edit"
                  src={Menu}
                ></img>
              </div>
              <div className="PostSection__content-commentSection--comment">
                {element.comment}
              </div>
            </div>
          </div>
        );
      });
    }
  };

  render() {
    return (
      <div className="PostSection">
        {this.outputContent()}
        <button
          className="PostSection__button-left"
          onClick={() => this.plusDivs(-1)}
        >
          &#10094;
        </button>
        <button
          className="PostSection__button-right"
          onClick={() => this.plusDivs(+1)}
        >
          &#10095;
        </button>
      </div>
    );
  }
}
