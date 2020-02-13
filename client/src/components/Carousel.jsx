import React, { Component } from "react";
import * as faceapi from "face-api.js";
import Postercarousel from "./Postercarousel";
// import { inject, PropTypes, observer } from "mobx-react";

import { socket } from "../App.js";

import carousel1 from "../assets/img/carousel/carousel1.jpg";
import carousel2 from "../assets/img/carousel/carousel2.jpg";
import carousel3 from "../assets/img/carousel/carousel3.jpg";

class Carousel extends Component {
  // prevents memory leak error, since we're using setState in an async function
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    // this.onCall = this.onCall.bind(this);
    this.state = {
      video: null,
      detected: false,
      timeSinceDetectedFace: 0,
      constraints: {
        audio: false,
        video: { width: 480, height: 720 }
      },
      posterArray: [carousel1, carousel2, carousel3],
      posterIndex: 0
    };
    // this.detect = this.detect.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.timerPoster = setInterval(() => this.tick(), 3000);
    socket.on("stopCarousel", () => {
      console.log("stop carousel er wordt gebeld POSTERCAROUSEL");
      // this.state.isBeingCalled = true;
      this.props.history.push("/called");
    });
    socket.emit("landing");
    socket.emit("resetSocketVariables");
    // getting access to webcam
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then(
    //     stream => (this.videoTag.current.srcObject = stream) /*, this.detect()*/
    //   )
    //   .catch(console.log("failed to get user media"));
    this.getCamera();
  }

  getCamera = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        this.state.constraints
      );
      this.videoTag.current.srcObject = stream;
      this.detect();
    } catch (err) {
      console.log("kapoet");
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    // Make sure async functions don't crash when switching components
    let stream = this.videoTag.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.videoTag.current.srcObject = null;
    clearInterval(this.timerID);
    clearInterval(this.timerPoster);
  }

  detect = async () => {
    // Videotag
    const videoTag = this.videoTag.current;

    // Detect whether a face is on the screen
    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    const displaySize = { width: videoTag.width, height: videoTag.height };
    console.log("displaySize", displaySize);

    // Check every 0.5s if there is a face on the webcam
    this.timerID = setInterval(async () => {
      if (this.state.detected === false) {
        if (this._isMounted) {
          const detections = await faceapi.detectAllFaces(videoTag);
          if (detections.length > 0) {
            console.log("eerste detectie");
            if (this.state.timeSinceDetectedFace >= 2000) {
              console.log("2 seconden lang eeen gezicht");
              // this.state.detected = true;
              this.setState({ detected: true });
              this.props.history.push("/screensaver");
            }
            if (this._isMounted) {
              this.setState({
                timeSinceDetectedFace: this.state.timeSinceDetectedFace + 500
              });
            }
          } else {
            // Reset the time since detection
            if (this._isMounted) {
              this.setState({ timeSinceDetectedFace: 0 });
            }
          }
        }
      }
    }, 500);
  };

  // onCall = () => {
  //   console.log("on call postercarousel");
  //   this.props.history.push("/called");
  // };

  tick() {
    if (this.state.posterIndex < this.state.posterArray.length - 1) {
      this.setState({ posterIndex: this.state.posterIndex + 1 });
    } else {
      this.setState({ posterIndex: 0 });
    }
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <>
          <img
            src={this.state.posterArray[this.state.posterIndex]}
            alt=""
            style={{ width: "100%", height: "auto" }}
          ></img>
          {/* <Postercarousel onCall={this.onCall} timeOut={3000} /> */}
          <div>
            <div>
              <video
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  visibility: "hidden"
                }}
                id="videoTag"
                ref={this.videoTag}
                width={500}
                height={500}
                autoPlay
                muted
              ></video>
            </div>
          </div>
        </>
      </div>
    );
  }
}
// export default inject(`store`)(observer(Carousel));
export default Carousel;
