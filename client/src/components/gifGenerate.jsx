import React, { Component } from "react";
import gifshot from "gifshot";
import axios from "axios";
import RecordIcon from "../assets/icon/recording.png";
import Cancel from "../assets/icon/cancel.png";
import Upload from "../assets/icon/openUpload.png";

var chunks = [];
var cams = [];
var url = "http://localhost:8080";
var dataUrl;
export default class gifGenerate extends Component {
  constructor() {
    super();
    this.mediaRecorder = null;
    this.recording = null;
    // monitor if recorded button is clicked
    this.cameraStarted = false;
    this.screenStarted = false;
    this.state = {
      recorded: undefined,
      camRecorded: undefined,
      curMode: "SCREEN"
    };
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
        var animatedImage = document.getElementsByClassName(
          "generate__mid-webCam--img"
        )[0];
        animatedImage.src = image;
        // document.body.appendChild(animatedImage);
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

    //stop recording
    this.mediaRecorder.stop();
    this.mediaRecorder = null;

    // stop real time live
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
    this.setState({ camRecorded: null });
  };

  uploadHandler = () => {
    if (
      this.state.camRecorded === undefined &&
      this.state.recorded === undefined
    ) {
      alert("Nothing is recorded yet");
    } else {
      console.log("lalala");
      let overlay = document.getElementsByClassName("generate__overlay")[0];
      let video = document.getElementsByClassName(
        "generate__overlay-upload--preview--src"
      )[0];

      overlay.style.display = "flex";
      if (this.state.recorded !== null) {
        video.src = this.state.recorded;
      } else if (this.state.camRecorded !== null) {
        video.src = this.state.camRecorded;
      } else {
        alert("Something wrong");
      }

      let reader = new FileReader();

      reader.addEventListener("load", () => {
        console.log(reader.result);
        dataUrl = reader.result;
      });

      let file;
      if (this.state.recorded !== null) {
        file = new File(chunks, "name", { type: "video/mp4" });
      } else if (this.state.camRecorded !== null) {
        file = new File(cams, "name", { type: "video/mp4" });
      }

      console.log(file);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  openCam = () => {
    let realtimeContainer = document.getElementsByClassName(
      "generate__mid-realtime"
    )[0];
    let previewContainer = document.getElementsByClassName(
      "generate__mid-preview"
    )[0];
    realtimeContainer.style.display = "flex";
    previewContainer.style.display = "none";

    if (this.hasGetUserMedia()) {
      const constraints = { video: true };
      const video = document.getElementsByClassName(
        "generate__mid-realtime--video"
      )[0];
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        video.srcObject = stream;

        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm"
        });
        console.log(this.mediaRecorder);
        this.mediaRecorder.addEventListener("dataavailable", event => {
          if (event.data && event.data.size > 0) {
            cams.push(event.data);
          }
        });
        this.mediaRecorder.start(10);
      });
    } else {
      alert(" Your browser did not support getUserMedia() ");
    }
  };

  closeCam = () => {
    const video = document.getElementsByClassName(
      "generate__mid-realtime--video"
    )[0];
    let tracks = video.srcObject.getTracks();

    //stop recording
    this.mediaRecorder.stop();
    this.mediaRecorder = null;

    tracks.forEach(track => track.stop());
    video.srcObject = null;

    this.recording = window.URL.createObjectURL(
      new Blob(cams, { type: "video/mp4" })
    );

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

    this.setState({ camRecorded: this.recording });
    this.setState({ recorded: null });
  };

  submitHandler = event => {
    event.preventDefault();
    let video = document.getElementsByClassName(
      "generate__overlay-upload--preview--src"
    )[0];

    let newPost = {
      name: "Anonymous",
      comment: event.target.comment.value,
      image: "",
      video: dataUrl
    };
    console.log(dataUrl);
    axios.post(`${url}/comment`, newPost).then(response => {
      console.log(response.data);
    });

    event.target.reset();

    let overlay = document.getElementsByClassName("generate__overlay")[0];
    alert("New post posted");
    overlay.style.display = "none";
    this.cancelButtonHandler();
  };

  overlayCancelHandler = () => {
    let overlay = document.getElementsByClassName("generate__overlay")[0];
    overlay.style.display = "none";
    let video = document.getElementsByClassName(
      "generate__overlay-upload--preview--src"
    )[0];
    video.src = null;
    this.cancelButtonHandler();
  };

  screenButtonHandler = event => {
    let screenButton = event.target;
    let cameraButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--webcam"
    )[0];

    if (this.cameraStarted) {
      alert("Camera recording....Do not switch mode");
    } else {
      // style the button tab
      screenButton.style.zIndex = "3";
      screenButton.style.marginLeft = "-2%";
      screenButton.style.width = "100%";
      screenButton.style.backgroundColor = "lightgray";
      cameraButton.style.zIndex = "1";
      cameraButton.style.marginLeft = "0";
      cameraButton.style.width = "90%";
      cameraButton.style.backgroundColor = "white";

      //screen record mode
      this.setState({ curMode: "SCREEN" });
    }
  };

  cameraButtonHandler = event => {
    let cameraButton = event.target;
    let screenButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--screen"
    )[0];

    if (this.screenStarted) {
      alert("Screen recording....Do not switch mode");
    } else {
      // style the button tab
      cameraButton.style.zIndex = "3";
      cameraButton.style.marginLeft = "-2%";
      cameraButton.style.width = "100%";
      cameraButton.style.backgroundColor = "lightgray";
      screenButton.style.zIndex = "1";
      screenButton.style.marginLeft = "0";
      screenButton.style.width = "90%";
      screenButton.style.backgroundColor = "white";

      // Camera record mode
      this.setState({ curMode: "CAMERA" });
    }
  };

  recordButtonHandler = curMode => {
    if (curMode === "CAMERA") {
      // in cmaera mode now
      if (!this.cameraStarted) {
        //start recording
        console.log("Start recording in CAMERA mode");
        this.cameraStarted = true;
        this.openCam();
      } else {
        //stop recording
        console.log("Stop recording in CAMERA mode");
        this.cameraStarted = false;
        this.closeCam();
      }
    } else if (curMode === "SCREEN") {
      // in screen capture mode now
      if (!this.screenStarted) {
        // starting
        console.log("Start recording in Screen Mode");
        this.screenStarted = true;
        this.startCapture();
      } else {
        //stop recording
        console.log("Stop recording in Screen mode");
        this.screenStarted = false;
        this.stopCapture();
      }
    }
  };

  cancelButtonHandler = () => {
    // reset view, clear preview src and set real time src to null
    let realtimeContainer = document.getElementsByClassName(
      "generate__mid-realtime"
    )[0];
    let previewContainer = document.getElementsByClassName(
      "generate__mid-preview"
    )[0];
    realtimeContainer.style.display = "flex";
    previewContainer.style.display = "none";

    let preview = document.getElementsByClassName(
      "generate__mid-preview--video"
    )[0];
    preview.src = null;

    let realtime = document.getElementsByClassName(
      "generate__mid-realtime--video"
    )[0];

    realtime.src = null;
    this.recording = null;
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
                onClick={() => {
                  this.overlayCancelHandler();
                }}
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
        <div className="generate__mid">
          <div className="generate__mid-realtime">
            <video className="generate__mid-realtime--video" autoPlay></video>
            <div className="generate__mid-realtime--switch">
              <button
                className="generate__mid-realtime--switch--screen"
                onClick={event => {
                  this.screenButtonHandler(event);
                }}
              >
                SCREEN
              </button>
              <button
                className="generate__mid-realtime--switch--webcam"
                onClick={event => {
                  this.cameraButtonHandler(event);
                }}
              >
                WEBCAM
              </button>
            </div>
          </div>

          <div className="generate__mid-preview">
            <video
              className="generate__mid-preview--video"
              autoPlay
              loop
            ></video>
          </div>

          <div className="generate__mid-control">
            <button
              className="generate__mid-control--cancel"
              onClick={() => {
                this.cancelButtonHandler();
              }}
            >
              <img
                className="generate__mid-control--cancel--icon"
                src={Cancel}
              ></img>
            </button>

            <button
              className="generate__mid-control--recordButton"
              onClick={() => {
                this.recordButtonHandler(this.state.curMode);
              }}
            >
              <img
                className="generate__mid-control--recordButton--icon"
                src={RecordIcon}
              ></img>
            </button>

            <button
              className="generate__mid-control--upload"
              onClick={() => {
                this.uploadHandler();
              }}
            >
              <img
                className="generate__mid-control--upload--icon"
                src={Upload}
                alt="upload button"
              ></img>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
