import React, { Component } from "react";
import AddComment from "./AddComment";
import PostSection from "./PostSection";
import axios from "axios";
import upload from "../assets/icon/upload.png";

var url = "http://localhost:8080";
var imgUrl;
var submitFlag = false;
export default class Community extends Component {
  constructor() {
    super();
    // this.fRef = React.createRef();
    this.state = { post: [] };
  }

  componentDidMount() {
    axios.get(`${url}/comment`).then(response => {
      this.setState({ post: response.data });
    });

    // this.uploadImg();
  }

  // uploadImg = () => {
  //   let uploadInput = document.getElementById("upload__img");
  //   let img = document.getElementsByClassName(
  //     "AddComment__form-upload--preview--img"
  //   )[0];

  //   window.addEventListener("load", () => {
  //     console.log("window loaded");
  //     uploadInput.addEventListener("change", event => {
  //       let input = document.getElementsByClassName(
  //         "AddComment__form-upload--button"
  //       )[0].files[0];
  //       let reader = new FileReader();
  //       console.log(input);
  //       reader.addEventListener("load", () => {
  //         img.src = reader.result;
  //         console.log(reader.result);
  //         imgUrl = reader.result;
  //       });

  //       if (input) {
  //         reader.readAsDataURL(input);
  //       }
  //       // img.src = reader.readAsDataURL(input).result;
  //       // img.src = URL.createObjectURL(event.target.files[0]);
  //     });
  //   });
  // };

  componentDidUpdate() {
    // console.log(this.fRef);
    // this.fRef.current.addEventListener("submit", event => {
    //   console.log("Form submit event fired!!");
    //   console.log(this.fRef);
    //   event.preventDefault();
    //   let newComment = {
    //     name: "Anonymous ",
    //     comment: event.target.comment.value,
    //     image: imgUrl,
    //     video: ""
    //   };
    //   axios
    //     .post(`${url}/comment`, newComment)
    //     .then(response => {
    //       // alert("New Post Added.");
    //       console.log(response.data);
    //     })
    //     .then(() => {
    //       axios.get(`${url}/comment`).then(response => {
    //         console.log(response.data);
    //         this.setState({ post: response.data });
    //       });
    //     });
    //   let img = document.getElementsByClassName(
    //     "AddComment__form-upload--preview--img"
    //   )[0];
    //   img.src = upload;
    //   event.target.reset();
    // });
  }

  render() {
    return (
      <div className="community">
        <PostSection post={this.state.post} flag={this.fRef} />
        {/* <hr className="community__seperater"></hr> */}
        {/* <AddComment flag={this.fRef} /> */}
      </div>
    );
  }
}
