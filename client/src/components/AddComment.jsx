import React, { Component } from "react";
import axios from "axios";

var url = "http://localhost:8080";

export default class AddComment extends Component {
  submitHandler = event => {
    event.preventDefault();
    console.log(event.target.comment.value);
    let newComment = {
      name: "Anonymous ",
      comment: event.target.comment.value
    };
    axios.post(`${url}/comment`, newComment).then(response => {
      alert("New Post Added.");
      console.log(response.data);
    });
    event.target.reset();
  };
  render() {
    return (
      <div className="AddComment">
        <form className="AddComment__form" ref={this.props.flag}>
          <div className="AddComment__form-upload"></div>

          <textarea
            className="AddComment__form-input"
            name="comment"
            placeholder="Enter your comment here"
          ></textarea>

          <button className="AddComment__form-button" type="submit">
            UPLOAD
          </button>
        </form>
      </div>
    );
  }
}
