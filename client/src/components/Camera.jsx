import React, { Component } from "react";
import * as faceapi from "face-api.js";
import Postercarousel from "../components/Postercarousel";
import { inject, PropTypes, observer } from "mobx-react";

class Camera extends Component {
  // prevents memory leak error, since we're using setState in an async function
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.state = {
      video: null,
      timeSinceDetectedFace: 0,
      detected: false
    };
    this.detect = this.detect.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    // getting access to webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (this.videoTag.current.srcObject = stream), this.detect())
      .catch(console.log("failed to get user media"));
  }

  componentWillUnmount() {
    // Make sure async functions don't crash when switching components
    this._isMounted = false;
    clearInterval(this.timerID);
  }

  detect = async () => {
    // Videotag
    const videoTag = this.videoTag.current;

    // Detect whether a face is on the screen
    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    const displaySize = { width: videoTag.width, height: videoTag.height };
    console.log("displaySize", displaySize);

    // Check every 400ms whether the face is still on the webcam
    this.timerID = setInterval(async () => {
      if (this.state.detected === false) {
        const detections = await faceapi.detectAllFaces(videoTag);

        console.log(detections.length);
        if (this._isMounted) {
          if (detections.length > 0) {
            // If a face has been on the screen for x seconds, move to the onboarding
            if (this.state.timeSinceDetectedFace >= 2000) {
              console.log("3 seconden lang een gezicht");
              this.state.detected = true;
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
    if (this.state.detected === true) {
      store.setDetected();
    }

    return (
      <div style={{ position: "relative" }}>
        <>
          <Postercarousel timeOut={3000} />
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
export default inject(`store`)(observer(Camera));
