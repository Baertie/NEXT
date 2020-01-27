import React, { Component } from "react";
import * as faceapi from "face-api.js";
import Postercarousel from "../components/Postercarousel";
import { inject, PropTypes, observer } from "mobx-react";

class Camera extends Component {
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
    console.log(faceapi.nets);

    // getting access to webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (this.videoTag.current.srcObject = stream), this.detect())
      .catch(console.log);

    // console.log("mount comp");
  }

  detect = async () => {
    const videoTag = this.videoTag.current;
    const canvas = this.canvasTag.current;

    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    const displaySize = { width: videoTag.width, height: videoTag.height };
    console.log("displaySize", displaySize);
    //faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      if (this.state.detected === false) {
        const detections = await faceapi.detectAllFaces(videoTag);
        console.log(detections.length);
        if (detections.length > 0) {
          //console.log("tijd sinds detectie", this.state.timeSinceDetectedFace);

          if (this.state.timeSinceDetectedFace >= 2000) {
            console.log("1 seconde lang een gezicht");
            this.state.detected = true;
          }
          this.setState({
            timeSinceDetectedFace: this.state.timeSinceDetectedFace + 200
          });
        } else {
          this.setState({ timeSinceDetectedFace: 0 });
        }
      }
      //   const resizedDetections = faceapi.resizeResults(detections, displaySize);
      //   canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      //   faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 200);
  };

  render() {
    const { store } = this.props;
    if (this.state.detected === true) {
      store.setDetected(true);
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
              {/* <canvas
              style={{ position: "absolute", top: "0", left: "0" }}
              id="myCanvas"
              ref={this.canvasTag}
              height={500}
              width={500}
            ></canvas> */}
            </div>
          </div>
        </>
      </div>
    );
  }
}
export default inject(`store`)(observer(Camera));
