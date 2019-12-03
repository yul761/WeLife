import React, { Component } from "react";
import gifshot from "gifshot";
import axios from "axios";

var chunks = [];
var url = "http://localhost:8080";
var dataUrl;
export default class gifGenerate extends Component {
  constructor() {
    super();
    this.mediaRecorder = null;
    this.recording = null;
    this.state = { recorded: undefined };
  }

  componentDidMount() {
    this.settingupCamera();
  }

  createGif = () => {
    console.log("Create gif executed");
    gifshot.createGIF({ numFrames: 100 }, function(obj) {
      if (!obj.error) {
        console.log(obj);
        var image = obj.image;
        var animatedImage = document.getElementById("animatedImg");
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    });
  };

  hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  hasGetDisplayMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
  };
  settingupCamera = () => {
    console.log("settingup camera executed");

    // ***********Open camera****************//
    // if (this.hasGetUserMedia()) {
    //   const constraints = { video: true };
    //   const video = document.getElementById("previewCamera");
    //   navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    //     video.srcObject = stream;
    //   });
    // } else {
    //   alert(" Your browser did not support getUserMedia() ");
    // }

    // if (this.hasGetDisplayMedia()) {
    //   const screen = document.getElementById("screenMedia");
    //   navigator.mediaDevices
    //     .getDisplayMedia({ video: true, width: "950px" })
    //     .then(stream => {
    //       screen.srcObject = stream;
    //     });
    // } else {
    //   alert("Your browser did not getdisplaymedia()");
    // }
  };

  startCapture = () => {
    let realtimeContainer = document.getElementsByClassName(
      "generate__mid-realtime"
    )[0];
    let previewContainer = document.getElementsByClassName(
      "generate__mid-preview"
    )[0];
    realtimeContainer.style.display = "flex";
    previewContainer.style.display = "none";
    if (this.hasGetDisplayMedia()) {
      const screen = document.getElementsByClassName(
        "generate__mid-realtime--video"
      )[0];
      navigator.mediaDevices.getDisplayMedia({ video: true }).then(stream => {
        screen.srcObject = stream;
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm"
        });
        console.log(this.mediaRecorder);
        this.mediaRecorder.addEventListener("dataavailable", event => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        });
        this.mediaRecorder.start(10);
      });
    } else {
      alert("Your browser did not getdisplaymedia()");
    }
  };

  stopCapture = () => {
    const screen = document.getElementsByClassName(
      "generate__mid-realtime--video"
    )[0];
    let tracks = screen.srcObject.getTracks();
    console.log(tracks);
    this.mediaRecorder.stop();
    this.mediaRecorder = null;

    tracks.forEach(track => track.stop());
    screen.srcObject = null;

    this.recording = window.URL.createObjectURL(
      new Blob(chunks, { type: "video/mp4" })
    );
    console.log(chunks);
    console.log(new Blob(chunks, { type: "video/mp4" }));

    let realtimeContainer = document.getElementsByClassName(
      "generate__mid-realtime"
    )[0];
    let previewContainer = document.getElementsByClassName(
      "generate__mid-preview"
    )[0];
    realtimeContainer.style.display = "none";
    previewContainer.style.display = "flex";
    let result = document.getElementsByClassName(
      "generate__mid-preview--video"
    )[0];
    result.src = this.recording;

    this.setState({ recorded: this.recording });

    console.log(this.recording);
  };

  uploadHandler = () => {
    if (this.recording === null) {
      alert("Nothing is recorded yet");
    } else {
      console.log("lalala");
      let overlay = document.getElementsByClassName("generate__overlay")[0];
      let video = document.getElementsByClassName(
        "generate__overlay-upload--preview--src"
      )[0];

      overlay.style.display = "flex";
      video.src = this.state.recorded;

      let reader = new FileReader();

      reader.addEventListener("load", () => {
        console.log(reader.result);
        dataUrl = reader.result;
      });

      let file = new File(chunks, "name", { type: "video/mp4" });
      console.log(file);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  submitHandler = event => {
    event.preventDefault();
    let video = document.getElementsByClassName(
      "generate__overlay-upload--preview--src"
    )[0];

    let newPost = {
      name: "Anonymous",
      comment: event.target.comment.value,
      image: dataUrl
    };
    console.log(dataUrl);
    axios.post(`${url}/comment`, newPost).then(response => {
      console.log(response.data);
    });

    event.target.reset();
  };

  render() {
    return (
      <div className="generate">
        <div className="generate__overlay">
          <form
            className="generate__overlay-upload"
            onSubmit={event => {
              this.submitHandler(event);
            }}
          >
            <div className="generate__overlay-upload--preview">
              <video
                className="generate__overlay-upload--preview--src"
                autoPlay
                loop
              ></video>
            </div>
            <textarea
              className="generate__overlay-upload--comment"
              placeholder="Enter your comment here"
              name="comment"
              defaultValue="This is text area"
            ></textarea>
            <div className="generate__overlay-upload--controls">
              <button
                className="generate__overlay-upload--controls--upload"
                type="submit"
              >
                UPLOAD
              </button>
              <button
                className="generate__overlay-upload--controls--cancel"
                type="button"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
        <div className="generate__mid">
          <div className="generate__mid-realtime">
            <video className="generate__mid-realtime--video" autoPlay></video>
          </div>

          <div className="generate__mid-preview">
            <video
              className="generate__mid-preview--video"
              autoPlay
              loop
            ></video>
          </div>
          {/* <video id="resultVideo" autoPlay loop></video>
        <video id="screenMedia" autoPlay></video> */}

          <div className="generate__mid-control">
            <button
              id="start"
              className="generate__mid-control--start"
              onClick={() => {
                this.startCapture();
              }}
            >
              Start Capture
            </button>
            <button
              id="stop"
              className="generate__mid-control--stop"
              onClick={() => {
                this.stopCapture();
              }}
            >
              Stop Capture
            </button>

            <button
              className="generate__mid-control--upload"
              onClick={() => {
                this.uploadHandler();
              }}
            >
              UPLOAD
            </button>
          </div>
        </div>
      </div>
    );
  }
}
