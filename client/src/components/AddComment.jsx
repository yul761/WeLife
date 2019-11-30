import React, { Component } from "react";
import axios from "axios";
import upload from "../assets/icon/upload.png";
import $ from "jquery";

var url = "http://localhost:8080";

export default class AddComment extends Component {
  componentDidMount() {
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
      });
    });
  };

  render() {
    return (
      <div className="AddComment">
        <form className="AddComment__form" ref={this.props.flag}>
          <div className="AddComment__form-upload">
            <label
              htmlFor="upload__img"
              className="AddComment__form-upload--preview"
            >
              <img
                className="AddComment__form-upload--preview--img"
                src={upload}
              ></img>
            </label>

            <input
              className="AddComment__form-upload--button"
              id="upload__img"
              type="file"
              name="upload"
            >
              {/* <img
                className="AddComment__form-upload--button--icon"
                src={upload}
              ></img> */}
            </input>
          </div>

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
