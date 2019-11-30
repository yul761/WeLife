import React, { Component } from "react";
import AddComment from "./AddComment";
import PostSection from "./PostSection";
import axios from "axios";
import upload from "../assets/icon/upload.png";

var url = "http://localhost:8080";
var imgUrl;
export default class Community extends Component {
  constructor() {
    super();
    this.fRef = React.createRef();
    this.state = { post: [] };
  }

  componentDidMount() {
    axios.get(`${url}/comment`).then(response => {
      console.log(response.data);
      this.setState({ post: response.data });
    });

    this.uploadImg();
  }

  uploadImg = () => {
    let uploadInput = document.getElementById("upload__img");
    let img = document.getElementsByClassName(
      "AddComment__form-upload--preview--img"
    )[0];
    window.addEventListener("load", () => {
      uploadInput.addEventListener("change", event => {
        img.src = URL.createObjectURL(event.target.files[0]);
        console.log(URL.createObjectURL(event.target.files[0]));
        imgUrl = URL.createObjectURL(event.target.files[0]);
      });
    });
  };

  componentDidUpdate() {
    this.fRef.current.addEventListener("submit", event => {
      event.preventDefault();
      console.log(event.target.comment.value);
      console.log(event.target.upload.value);
      let newComment = {
        name: "Anonymous ",
        comment: event.target.comment.value,
        image: imgUrl
      };
      axios
        .post(`${url}/comment`, newComment)
        .then(response => {
          alert("New Post Added.");
          console.log(response.data);
        })
        .then(() => {
          axios.get(`${url}/comment`).then(response => {
            console.log(response.data);
            this.setState({ post: response.data });
          });
        });

      let img = document.getElementsByClassName(
        "AddComment__form-upload--preview--img"
      )[0];
      img.src = upload;
      event.target.reset();
    });
  }

  render() {
    return (
      <div className="community">
        <PostSection post={this.state.post} flag={this.fRef} />
        <hr className="community__seperater"></hr>
        <AddComment flag={this.fRef} />
      </div>
    );
  }
}
