import React, { Component } from "react";
import gifshot from "gifshot";
import axios from "axios";
import RecordIcon from "../assets/icon/recording.png";
import Cancel from "../assets/icon/cancel.png";
import Upload from "../assets/icon/openUpload.png";
import Screen from "../assets/icon/monitor.png";
import Camera from "../assets/icon/camera.png";
import IconUpload from "../assets/icon/upload.png";
import AddComment from "../components/AddComment";

var chunks = [];
var cams = [];
var url = "http://localhost:8080";
var dataUrl;
var imgUrl;
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
    this.uploadImg();
  }

  componentDidUpdate() {
    this.uploadImg();
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
    chunks = [];
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
    cams = [];
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
    this.resetViewHandler();
  };

  overlayCancelHandler = () => {
    let overlay = document.getElementsByClassName("generate__overlay")[0];
    overlay.style.display = "none";
    let video = document.getElementsByClassName(
      "generate__overlay-upload--preview--src"
    )[0];
    video.src = null;
    this.resetViewHandler();
  };

  screenButtonHandler = event => {
    let screenButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--screen"
    )[0];
    let cameraButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--webcam"
    )[0];
    let localUpload = document.getElementsByClassName(
      "generate__mid-realtime--switch--upload"
    )[0];

    if (this.cameraStarted) {
      alert("Camera recording....Do not switch mode");
    } else {
      // style the button tab
      screenButton.style.zIndex = "3";
      screenButton.style.marginLeft = "-2%";
      screenButton.style.width = "100%";
      screenButton.style.backgroundColor = "rgb(255, 255, 255)";
      cameraButton.style.zIndex = "2";
      cameraButton.style.marginLeft = "0";
      cameraButton.style.width = "95%";
      cameraButton.style.backgroundColor = "rgb(230, 230, 230)";
      localUpload.style.zIndex = "1";
      localUpload.style.marginLeft = "0";
      localUpload.style.width = "90%";
      localUpload.style.backgroundColor = "rgb(230, 230, 230)";

      //screen record mode
      this.setState({ curMode: "SCREEN" });
    }
  };

  cameraButtonHandler = event => {
    let cameraButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--webcam"
    )[0];
    let screenButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--screen"
    )[0];
    let localUpload = document.getElementsByClassName(
      "generate__mid-realtime--switch--upload"
    )[0];

    if (this.screenStarted) {
      alert("Screen recording....Do not switch mode");
    } else {
      // style the button tab
      cameraButton.style.zIndex = "3";
      cameraButton.style.marginLeft = "-2%";
      cameraButton.style.width = "100%";
      cameraButton.style.backgroundColor = "rgb(255, 255, 255)";
      screenButton.style.zIndex = "2";
      screenButton.style.marginLeft = "0";
      screenButton.style.width = "95%";
      screenButton.style.backgroundColor = "rgb(230, 230, 230)";
      localUpload.style.zIndex = "1";
      localUpload.style.marginLeft = "0";
      localUpload.style.width = "95%";
      localUpload.style.backgroundColor = "rgb(230, 230, 230)";

      // Camera record mode
      this.setState({ curMode: "CAMERA" });
    }
  };

  // click the local upload tab
  localUploadHandler = () => {
    let cameraButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--webcam"
    )[0];
    let screenButton = document.getElementsByClassName(
      "generate__mid-realtime--switch--screen"
    )[0];
    let localUpload = document.getElementsByClassName(
      "generate__mid-realtime--switch--upload"
    )[0];

    if (this.screenStarted) {
      alert("Screen recording....Do not switch mode");
    } else {
      // style the button tab
      localUpload.style.zIndex = "3";
      localUpload.style.marginLeft = "-2%";
      localUpload.style.width = "100%";
      localUpload.style.backgroundColor = "rgb(255, 255, 255)";
      cameraButton.style.zIndex = "2";
      cameraButton.style.marginLeft = "0";
      cameraButton.style.width = "95%";
      cameraButton.style.backgroundColor = "rgb(230, 230, 230)";
      screenButton.style.zIndex = "1";
      screenButton.style.marginLeft = "0";
      screenButton.style.width = "90%";
      screenButton.style.backgroundColor = "rgb(230, 230, 230)";

      // local upload mode
      this.setState({ curMode: "LOCALUPLOAD" });
    }
  };

  startRecordButtonAnimation = () => {
    let recordbuttonIcon = document.getElementsByClassName(
      "generate__mid-control--recordButton--icon"
    )[0];
    recordbuttonIcon.style.animationName = "pulse";
    recordbuttonIcon.style.animationDuration = "1.5s";
    recordbuttonIcon.style.animationIterationCount = "infinite";
    recordbuttonIcon.style.animationTimingFunction = "linear";

    // return recordbuttonIcon.animate(
    //   [
    //     {
    //       "0%": { "box-shadow": "0px 0px 5px 0px rgba(0, 0, 0, 0.3)" },
    //       "65%": { "box-shadow": "0px 0px 5px 13px rgba(0, 0, 0, 0.3)" },
    //       "90%": { "box-shadow": "0px 0px 5px 13px rgba(0, 0, 0, 0)" }
    //     }
    //   ],
    //   {
    //     duration: 1500,
    //     iterations: Infinity,
    //     easing: "linear"
    //   }
    // );
  };

  stopRecordButtonAnimation = () => {
    let recordbuttonIcon = document.getElementsByClassName(
      "generate__mid-control--recordButton--icon"
    )[0];
    recordbuttonIcon.style.animationName = "";
  };

  recordButtonHandler = curMode => {
    let uploadform = document.getElementsByClassName(
      "generate__mid-uploadform"
    )[0];
    // let recordAnimation = this.RecordButtonAnimationSetup();
    // console.log(recordAnimation);

    if (curMode === "CAMERA") {
      uploadform.style.display = "none";
      // in cmaera mode now
      if (!this.cameraStarted) {
        //start recording
        console.log("Start recording in CAMERA mode");
        this.cameraStarted = true;
        this.openCam();
        this.startRecordButtonAnimation();

        console.log("Animation start");
      } else {
        //stop recording
        console.log("Stop recording in CAMERA mode");
        this.cameraStarted = false;
        this.closeCam();
        this.stopRecordButtonAnimation();

        console.log("Animation paused");
      }
    } else if (curMode === "SCREEN") {
      uploadform.style.display = "none";
      // in screen capture mode now
      if (!this.screenStarted) {
        // starting
        console.log("Start recording in Screen Mode");
        this.screenStarted = true;
        this.startCapture();
        this.startRecordButtonAnimation();

        console.log("Animation start");
      } else {
        //stop recording
        console.log("Stop recording in Screen mode");
        this.screenStarted = false;
        this.stopCapture();
        this.stopRecordButtonAnimation();

        console.log("Animation paused");
      }
    } else if (curMode === "LOCALUPLOAD") {
      // in local upload mode now
      console.log("In local upload now");
      let realtimeVideo = document.getElementsByClassName(
        "generate__mid-realtime--video"
      )[0];

      uploadform.style.display = "flex";
      uploadform.style.zIndex = "30";

      this.uploadImg();
    }
  };

  uploadImg = () => {
    console.log("uploadImg executed");
    let uploadInput = document.getElementById("upload__img");
    let img = document.getElementsByClassName(
      "generate__mid-uploadform--form--upload--preview--img"
    )[0];
    console.log(uploadInput);
    console.log(uploadInput.files[0]);

    console.log(img);

    // load event cannot fire !!!!!---Yuchen
    // window.onload = () => {
    // console.log("into window load event");
    uploadInput.addEventListener("change", event => {
      let input = document.getElementsByClassName(
        "generate__mid-uploadform--form--upload--button"
      )[0].files[0];
      console.log(input);
      let reader = new FileReader();
      console.log(input);
      reader.addEventListener("load", () => {
        img.src = reader.result;
        console.log(reader.result);
        imgUrl = reader.result;
      });
      console.log(input);
      if (input) {
        reader.readAsDataURL(input);
      }
      // img.src = reader.readAsDataURL(input).result;
      // img.src = URL.createObjectURL(event.target.files[0]);
    });
    console.log(uploadInput.files[0]);
    // };
  };

  formSubmitHandler = event => {
    event.preventDefault();
    let newComment = {
      name: "Anonymous",
      comment: event.target.comment.value,
      image: imgUrl,
      video: ""
    };

    axios
      .post(`${url}/comment`, newComment)
      .then(response => {
        // alert("New Post Added.");
        console.log(response.data);
      })
      .then(alert("New post added"));

    let img = document.getElementsByClassName(
      "generate__mid-uploadform--form--upload--preview--img"
    )[0];
    img.src = IconUpload;
    event.target.reset();
  };

  resetViewHandler = () => {
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
                <img
                  className="generate__mid-realtime--switch--screen--icon"
                  src={Screen}
                  alt="Screen icon"
                ></img>
              </button>
              <button
                className="generate__mid-realtime--switch--webcam"
                onClick={event => {
                  this.cameraButtonHandler(event);
                }}
              >
                <img
                  className="generate__mid-realtime--switch--webcam--icon"
                  src={Camera}
                  alt="Camera icon"
                ></img>
              </button>
              <button
                className="generate__mid-realtime--switch--upload"
                onClick={() => {
                  this.localUploadHandler();
                }}
              >
                <img
                  className="generate__mid-realtime--switch--upload--icon"
                  src={IconUpload}
                  alt="upload icon"
                ></img>
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

          <div className="generate__mid-uploadform">
            <form
              className="generate__mid-uploadform--form"
              onSubmit={event => {
                this.formSubmitHandler(event);
              }}
            >
              <div className="generate__mid-uploadform--form--upload">
                <label
                  htmlFor="upload__img"
                  className="generate__mid-uploadform--form--upload--preview"
                >
                  <img
                    className="generate__mid-uploadform--form--upload--preview--img"
                    src={IconUpload}
                  ></img>
                </label>

                <input
                  className="generate__mid-uploadform--form--upload--button"
                  id="upload__img"
                  type="file"
                  name="upload"
                ></input>
              </div>

              <textarea
                className="generate__mid-uploadform--form--upload--input"
                name="comment"
                placeholder="Enter your comment here"
              ></textarea>

              <input
                className="generate__mid-uploadform--form--upload--submit"
                type="submit"
                value="UPLOAD"
              />
            </form>
          </div>

          <div className="generate__mid-control">
            <button
              className="generate__mid-control--cancel"
              onClick={() => {
                this.resetViewHandler();
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
