import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import * as faceapi from "face-api.js";

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
      faceGone: false
    };
    this.detect = this.detect.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(
        stream => (this.ownVideoFeed.current.srcObject = stream),
        this.detect()
      )
      .catch(console.log("failed to get user media"));
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
    const store = this.props;
    store.setStartOnboarding();
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
    this.timerID = setInterval(async () => {
      if (this.state.faceGone === false) {
        const detections = await faceapi.detectAllFaces(videoTag);
        if (this._isMounted) {
          if (!detections[0]) {
            if (this.state.timeSinceDetectedFace >= 2000) {
              console.log("3 seconden lang geen gezicht");
              this.state.faceGone = true;
            }
            this.setState({
              timeSinceDetectedFace: this.state.timeSinceDetectedFace + 200
            });
          } else {
            // Reset the time since detection
            this.setState({ timeSinceDetectedFace: 0 });
          }
        }
      }
    }, 400);
  };

  render() {
    const { store } = this.props;
    if (this.state.faceGone === true) {
      store.resetEverything();
    }
    return (
      <>
        <p>Screensaver</p>
        <button onClick={this.handleStartButton}>Start game bro</button>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%"
          }}
        >
          <video
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              zIndex: 1,
              objectFit: "fill"
            }}
            id="ownVideoFeed"
            ref={this.ownVideoFeed}
            height={"100%"}
            width={"100%"}
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
              width: "100%",
              height: "auto"
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
              width: "100%",
              height: "auto"
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
              width: "100%",
              height: "auto"
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
              width: "100%",
              height: "auto"
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
              width: "100%",
              height: "auto"
            }}
          />
        </div>
      </>
    );
  }
}

export default inject(`store`)(observer(Screensaver));
