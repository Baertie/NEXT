import React, { Component } from "react";
import * as faceapi from "face-api.js";
import Postercarousel from "./Postercarousel";
// import { inject, PropTypes, observer } from "mobx-react";

class Carousel extends Component {
  // prevents memory leak error, since we're using setState in an async function
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.onCall = this.onCall.bind(this);
    this.state = {
      video: null,
      detected: false,
      timeSinceDetectedFace: 0
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

    // Check every 0.5s if there is a face on the webcam
    this.timerID = setInterval(async () => {
      if (this.state.detected === false) {
        const detections = await faceapi.detectAllFaces(videoTag);
        if (this._isMounted) {
          if (detections.length > 0) {
            console.log("eerste detectie");
            if (this.state.timeSinceDetectedFace >= 2000) {
              console.log("2 seconden lang eeen gezicht");
              this.state.detected = true;
            }
            this.setState({
              timeSinceDetectedFace: this.state.timeSinceDetectedFace + 500
            });
          } else {
            // Reset the time since detection
            this.setState({ timeSinceDetectedFace: 0 });
          }
        }
      }
    }, 500);
  };

  onCall = () => {
    console.log("on call postercarousel");
    this.props.history.push("/called");
  };

  render() {
    // const { store } = this.props;
    if (this.state.detected === true) {
      console.log("verander van pagina");
      this.props.history.push("/screensaver");
      // store.setDetected();
    }
    return (
      <div style={{ position: "relative" }}>
        <>
          <Postercarousel onCall={this.onCall} timeOut={3000} />
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
