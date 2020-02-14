import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import * as faceapi from "face-api.js";

import { socket } from "../App.js";

import styles from "../styles/Screensaver.module.css";

import topMagLighten from "../assets/effects/bm/topMag-lighten.png";
import topBlueLighten from "../assets/effects/bm/topBlue-lighten.png";
import botMagSoft from "../assets/effects/bm/botMag-softLight.png";
import botBlueSoft from "../assets/effects/bm/botBlue-softLight.png";
import whiteOverlay from "../assets/effects/overlay/whiteOverlay.png";

class Screensaver extends Component {
  // prevents memory leak error, since we're using setState in an async function
  _isMounted = false;
  constructor(props) {
    super(props);
    this.ownVideoFeed = React.createRef();
    this.state = {
      video: null,
      constraints: { audio: false, video: { width: "100%", height: "100%" } },
      timeSinceDetectedFace: 0,
      faceGone: false,
      isBeingCalled: false
    };
    this.detect = this.detect.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    socket.on("stopCarousel", () => {
      console.log("stop carousel er wordt gebeld SCREENSAVER");
      this.state.isBeingCalled = true;
    });
    this.getCamera();
  }

  getCamera = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        this.state.constraints
      );
      this.ownVideoFeed.current.srcObject = stream;
      this.detect();
    } catch (err) {
      console.log("kapoet");
    }
  };

  componentDidUpdate() {
    // This check is needed because this will now only happen on this screen.
    if (this.state.isBeingCalled === true) {
      console.log("minder direct bro");
      this.props.history.push("/called");
    }
  }

  componentWillUnmount() {
    let stream = this.ownVideoFeed.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.ownVideoFeed.current.srcObject = null;
    this._isMounted = false;
    clearInterval(this.timerID);
  }

  handleStartButton = () => {
    this.props.history.push("/onboarding");
  };

  detect = async () => {
    // Videotag
    const videoTag = this.ownVideoFeed.current;

    // Detect whether a face is on the screen
    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    const displaySize = { width: videoTag.width, height: videoTag.height };
    console.log("displaySize", displaySize);

    // Check every 1s if there is a face on the webcam
    // after 5s no face -> back to carousel

    // Face will never go away
    // return;
    this.timerID = setInterval(async () => {
      if (this.state.faceGone === false) {
        if (this._isMounted) {
          const detections = await faceapi.detectAllFaces(videoTag);
          if (!detections[0]) {
            if (this.state.timeSinceDetectedFace >= 2000) {
              console.log("3 seconden lang geen gezicht");
              this.setState({ faceGone: true });
              this.props.history.push("/");
            }
            if (this._isMounted) {
              this.setState({
                timeSinceDetectedFace: this.state.timeSinceDetectedFace + 500
              });
            }
          } else if (detections.length > 0) {
            if (this.state.timeSinceDetectedFace >= 2000) {
              this.props.history.push("/onboarding");
            }
            if (this._isMounted) {
              this.setState({
                timeSinceDetectedFace: this.state.timeSinceDetectedFace + 200
              });
            }
          } else {
            // Reset the time since detection
            this.setState({ timeSinceDetectedFace: 0 });
          }
        }
      }
    }, 400);
  };

  render() {
    return (
      <>
        <p className={styles.nextText}>Word het gezicht van NEXT</p>
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            maxWidth: "1080px",
            maxHeight: "1920px",
            overflow: "hidden"
          }}
        >
          <video
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px",
              zIndex: 1,
              transform: "scaleX(-1)"
            }}
            id="ownVideoFeed"
            ref={this.ownVideoFeed}
            height={"100vh"}
            width={"100vw"}
            autoPlay
            muted
          ></video>
          <img
            src={whiteOverlay}
            alt="NEXT branding overlay"
            style={{
              zIndex: 6,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px"
            }}
          />
          <img
            src={topBlueLighten}
            alt="Top blue effect overlay"
            style={{
              zIndex: 5,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px"
            }}
          />
          <img
            src={topMagLighten}
            alt="Top magenta effect overlay"
            style={{
              zIndex: 4,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px"
            }}
          />
          <img
            src={botBlueSoft}
            alt="Bottom blue effect overlay"
            style={{
              zIndex: 3,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px"
            }}
          />
          <img
            src={botMagSoft}
            alt="Bottom magenta effect overlay"
            style={{
              zIndex: 2,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              maxWidth: "1080px",
              maxHeight: "1920px"
            }}
          />
        </div>
      </>
    );
  }
}

export default inject(`store`)(observer(Screensaver));
