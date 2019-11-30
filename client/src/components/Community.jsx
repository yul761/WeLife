import React, { Component } from "react";
import AddComment from "./AddComment";
import PostSection from "./PostSection";
import axios from "axios";

var url = "http://localhost:8080";

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
  }

  componentDidUpdate() {
    this.fRef.current.addEventListener("submit", event => {
      event.preventDefault();
      console.log(event.target.comment.value);
      console.log(event.target.upload.value);
      let newComment = {
        name: "Anonymous ",
        comment: event.target.comment.value
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
