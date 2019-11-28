import React, { Component } from "react";

export default class AddComment extends Component {
  render() {
    return (
      <div className="AddComment">
        <form className="AddComment__form">
          <div className="AddComment__form-upload"></div>

          <input
            className="AddComment__form-input"
            name="comment"
            placeholder="Enter your comment here"
          ></input>

          <input
            className="AddComment__form-button"
            type="submit"
            value="UPLOAD"
          ></input>
        </form>
      </div>
    );
  }
}
