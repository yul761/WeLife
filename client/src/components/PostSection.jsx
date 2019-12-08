import React, { Component } from "react";
import $ from "jquery";
import Menu from "../assets/icon/menu.png";
import axios from "axios";

var IndexSlider = 1;
var flag;
var url = "http://localhost:8080";

export default class PostSection extends Component {
  constructor() {
    super();
    this.state = { sliderIndex: 1, curId: undefined, post: undefined };
  }

  componentDidMount() {
    flag = false;
    console.log("component did mount");
    axios.get(`${url}/comment`).then(response => {
      this.setState({ post: response.data });
    });
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

  openEditMenu = id => {
    let menu = document.getElementsByClassName("PostSection__overlay")[0];
    menu.style.display = "flex";
    this.setState({ curId: id });
  };

  MenuCancelButtonHandler = () => {
    let menu = document.getElementsByClassName("PostSection__overlay")[0];
    menu.style.display = "none";
  };

  MenuDeleteButtonHandler = () => {
    console.log(this.state.curId);
    axios
      .delete(`${url}/comment`, this.state.curId)
      .then(response => {
        console.log(response);
        let newpost = [];
        this.state.post.map(element => {
          if (element.id !== this.state.curId) {
            newpost.push(element);
          }
        });
        this.setState({ post: newpost });
      })
      .then(
        axios.get(`${url}/comment`).then(response => {
          this.setState({ post: response.data });
          let menu = document.getElementsByClassName("PostSection__overlay")[0];
          menu.style.display = "none";
        })
      );
  };

  addCommentHandler = (id, event, post) => {
    event.preventDefault();
    // let newComment = event.target.comment.value;
    let curTime = new Date();
    let newComment = {
      comment: event.target.comment.value,
      timestamp: curTime.getTime(),
      likes: 0
    };
    post.comment.push(newComment);

    axios.put(`${url}/comment/${id}`, post).then(response => {
      this.setState({ post: response.data });
      // console.log(response.data);
    });
    event.target.reset();
  };

  outputContent = () => {
    if (this.state.post === undefined) {
      return "Loading ...";
    } else {
      return this.state.post.map((element, index) => {
        if (index === this.state.post.length - 1) {
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
                <button
                  className="PostSection__content-commentSection--userInfo--edit"
                  onClick={() => {
                    this.openEditMenu(element.id);
                  }}
                >
                  <img
                    className="PostSection__content-commentSection--userInfo--edit--icon"
                    src={Menu}
                  ></img>
                </button>
              </div>
              <div className="PostSection__content-commentSection--comment">
                {/* {element.comment} */}
                {this.outputComment(element.comment)}
              </div>

              <div className="PostSection__content-commentSection--add">
                <form
                  className="PostSection__content-commentSection--add--form"
                  onSubmit={event => {
                    this.addCommentHandler(element.id, event, element);
                  }}
                >
                  <textarea
                    className="PostSection__content-commentSection--add--form--comment"
                    name="comment"
                    placeholder="Enter your comment here"
                  ></textarea>
                  <button
                    className="PostSection__content-commentSection--add--form--submit"
                    type="submit"
                  >
                    SUBMIT
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      });
    }
  };
  getTimeDiff = (date1, date2) => {
    let diff = date2 - date1;
    let dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    let result = dayDiff === 1 ? "1 day ago " : dayDiff + " days ago";
    if (dayDiff === 0) {
      let min = Math.floor(diff / (1000 * 60));
      let seconds = Math.floor(diff / 1000);
      let hours = Math.floor(diff / (1000 * 60 * 60));

      if (seconds > 60) {
        if (min > 60) {
          result = hours === 1 ? "1 hour ago " : hours + " hours ago";
        } else {
          result = min === 1 ? "1 minute ago " : min + " minutes ago ";
        }
      } else {
        result =
          seconds === 1 || seconds === 0
            ? `${seconds} second ago`
            : seconds + " seconds ago ";
      }
    } else if (dayDiff > 365) {
      result =
        Math.floor(dayDiff / 365) === 1
          ? "1 year ago "
          : Math.floor(dayDiff / 365) + " years ago ";
    }
    return result;
  };

  outputComment = commentArray => {
    return commentArray.map((element, index) => {
      return (
        <div
          className="PostSection__content-commentSection--comment--content"
          key={index}
        >
          <div className="PostSection__content-commentSection--comment--content--text">
            {element.comment}
          </div>
          <div className="PostSection__content-commentSection--comment--content--date">
            {this.getTimeDiff(new Date(element.timestamp), new Date())}
          </div>
        </div>
      );
    });
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

        <div className="PostSection__overlay">
          <div className="PostSection__overlay-option">
            <button
              className="PostSection__overlay-option--delete"
              onClick={() => {
                this.MenuDeleteButtonHandler();
              }}
            >
              DELETE
            </button>
            <button
              className="PostSection__overlay-option--cancel"
              onClick={() => {
                this.MenuCancelButtonHandler();
              }}
            >
              CALCEL
            </button>
          </div>
        </div>
      </div>
    );
  }
}
