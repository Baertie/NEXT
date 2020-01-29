import React, { Component } from "react";
import * as faceapi from "face-api.js";

import { inject, observer } from "mobx-react";
import io from "socket.io-client";

// https://github.com/chanind/curve-matcher
import { shapeSimilarity } from "curve-matcher";
import topRedLighten from "../assets/effects/br/topRed-lighten.png";
import topBlackLighten from "../assets/effects/br/topBlack-lighten.png";
import botRedSoft from "../assets/effects/br/botRed-softLight.png";
import botBlackSoft from "../assets/effects/br/botBlack-softLight.png";

import topMagLighten from "../assets/effects/bm/topMag-lighten.png";
import topBlueLighten from "../assets/effects/bm/topBlue-lighten.png";
import botMagSoft from "../assets/effects/bm/botMag-softLight.png";
import botBlueSoft from "../assets/effects/bm/botBlue-softLight.png";

import happyMan from "../assets/referenceImages/happyMan.jpg";

/* 
Landmark point structure

0 - 16: Underside face -- 17 points
17 - 21: left eyebrow -- 5 points
22 - 26: right eyebrow -- 5 points
27 - 30: nose bridge -- 4 points
31 - 35: nose bottom -- 5 points
36 - 41: left eye -- 6 points
42 - 47: right eye -- 6 points
48 - 59: outside mouth -- 12 points
60 - 67: inside mouth - 8 points

*/

let socket;

class Game extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.canvasTag = React.createRef();
    this.referenceImageTag = React.createRef();
    this.referenceCanvasTag = React.createRef();
    this.state = {
      video: null,
      constraints: { audio: false, video: { width: 480, height: 720 } },
      faceCurves: [],
      lEyebrowCurves: [],
      rEyebrowCurves: [],
      noseBridgeCurves: [],
      noseBotCurves: [],
      lEyeCurves: [],
      rEyeCurves: [],
      oMouthCurves: [],
      iMouthCurves: [],
      curves: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    // UNCOMMENT TO USE SOCKET
    // if (!socket) {
    //   socket = io(":4000");
    //   //   socket.connect("/");
    // }

    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(
        stream => (this.videoTag.current.srcObject = stream),
        this.loadModels()
      )
      .catch(console.log);

    // INIT SOCKET
    //this.initSocket();
  }

  initSocket = () => {
    // socket = io.connect(`/`);
    // socket.on(`connect`, () => console.log(socket.id));
    //console.log(`direct test zo`);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models");
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri("./models");

    this.getReferenceData();
  };

  getReferenceData = async () => {
    // const imageTag = this.referenceImageTag;
    const canvasTag = this.referenceCanvasTag.current;
    const ctx = canvasTag.getContext("2d");

    const referenceImage = new Image(626, 417);

    referenceImage.onload = async () => {
      //faceapi.matchDimensions(canvasTag, referenceImage);

      ctx.drawImage(referenceImage, 0, 0, canvasTag.width, canvasTag.height);

      const useTinyModel = true;
      const detectionsWithLandmarks = await faceapi
        .detectSingleFace(referenceImage)
        .withFaceLandmarks(useTinyModel);

      console.log(detectionsWithLandmarks);

      const landMarkPoints = detectionsWithLandmarks.landmarks.positions;
      this.addPointsToState(landMarkPoints);

      faceapi.draw.drawFaceLandmarks(canvasTag, detectionsWithLandmarks);
    };

    //referenceImage.crossOrigin = "anonymous";

    referenceImage.src = happyMan;
  };

  screenShot = async () => {
    // Get the video and canvas element through refs
    const videoTag = this.videoTag.current;
    const canvas = this.canvasTag.current;

    // Declare canvas context
    const ctx = canvas.getContext("2d");

    const displaySize = {
      width: videoTag.width,
      height: videoTag.height
    };
    faceapi.matchDimensions(canvas, displaySize);

    // Clear canvas and draw the video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoTag, 0, 0, canvas.width, canvas.height);

    // Run landmarkdetection (tiny) with faceapi
    const useTinyModel = true;
    const detectionsWithLandmarks = await faceapi
      .detectSingleFace(canvas)
      .withFaceLandmarks(useTinyModel);

    // Check if a face was detected
    if (detectionsWithLandmarks) {
      // Add landmarks to the state
      const landMarkPoints = detectionsWithLandmarks.landmarks.positions;
      this.addPointsToState(landMarkPoints);

      const resizedDetections = faceapi.resizeResults(
        detectionsWithLandmarks,
        displaySize
      );

      // Draw landmarks on canvas
      //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }

    this.addVisualEffects(canvas, ctx);
  };

  addVisualEffects = (canvas, ctx) => {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    let botBlueSoftImg = new Image();
    let botMagSoftImg = new Image();
    let topBlueLightenImg = new Image();
    let topMagLightenImg = new Image();

    botBlueSoftImg.onload = () => {
      ctx.globalCompositeOperation = "soft-light";
      ctx.drawImage(botBlueSoftImg, 0, 0, canvas.width, canvas.height);
    };

    botMagSoftImg.onload = () => {
      ctx.globalCompositeOperation = "soft-light";
      ctx.drawImage(botMagSoftImg, 0, 0, canvas.width, canvas.height);
    };

    topBlueLightenImg.onload = () => {
      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(topBlueLightenImg, 0, 0, canvas.width, canvas.height);
    };

    topMagLightenImg.onload = () => {
      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(botBlueSoftImg, 0, 0, canvas.width, canvas.height);
    };

    botBlueSoftImg.src = botBlueSoft;
    botMagSoftImg.src = botMagSoft;
    topBlueLightenImg.src = topBlueLighten;
    topMagLightenImg.src = topMagLighten;
  };

  addPointsToState = points => {
    let faceCurveArr = [],
      lEyebrowCurveArr = [],
      rEyebrowCurveArr = [],
      noseBridgeCurveArr = [],
      noseBotCurveArr = [],
      lEyeCurveArr = [],
      rEyeCurveArr = [],
      oMouthCurveArr = [],
      iMouthCurveArr = [];

    // Loop through the landmark points and split them per landmark
    for (let i = 0; i < 17; i++) {
      faceCurveArr.push(points[i]);
    }

    for (let i = 17; i < 22; i++) {
      lEyebrowCurveArr.push(points[i]);
    }

    for (let i = 22; i < 27; i++) {
      rEyebrowCurveArr.push(points[i]);
    }

    for (let i = 27; i < 31; i++) {
      noseBridgeCurveArr.push(points[i]);
    }

    for (let i = 31; i < 36; i++) {
      noseBotCurveArr.push(points[i]);
    }

    for (let i = 36; i < 42; i++) {
      lEyeCurveArr.push(points[i]);
    }

    for (let i = 42; i < 48; i++) {
      rEyeCurveArr.push(points[i]);
    }

    for (let i = 48; i < 60; i++) {
      oMouthCurveArr.push(points[i]);
    }

    for (let i = 60; i < 67; i++) {
      iMouthCurveArr.push(points[i]);
    }

    // Add all the arrays to the state
    this.setState(state => {
      state.curves.push(points);
      state.faceCurves.push(faceCurveArr);
      state.lEyebrowCurves.push(lEyebrowCurveArr);
      state.rEyebrowCurves.push(rEyebrowCurveArr);
      state.noseBridgeCurves.push(noseBridgeCurveArr);
      state.noseBotCurves.push(noseBotCurveArr);
      state.lEyeCurves.push(lEyeCurveArr);
      state.rEyeCurves.push(rEyeCurveArr);
      state.oMouthCurves.push(oMouthCurveArr);
      state.iMouthCurves.push(iMouthCurveArr);
    });
  };

  render() {
    const generateLandmarks = () => {
      // maps video frame to canvas and detects landmarks
      console.log("generate");
      this.screenShot();
    };

    const calculateDistance = () => {
      // Calculate the similarity between all the detected curves
      if (this.state.curves[0] && this.state.curves[1]) {
        const similarityFace = shapeSimilarity(
          this.state.faceCurves[0],
          this.state.faceCurves[1]
        );
        console.log("similarity face:", similarityFace);

        const similarityLEyeBrow = shapeSimilarity(
          this.state.lEyebrowCurves[0],
          this.state.lEyebrowCurves[1]
        );
        console.log("similarity LEyeBrow:", similarityLEyeBrow);

        const similarityREyeBrow = shapeSimilarity(
          this.state.rEyebrowCurves[0],
          this.state.rEyebrowCurves[1]
        );
        console.log("similarity REyeBrow:", similarityREyeBrow);

        const similarityNoseBridge = shapeSimilarity(
          this.state.noseBridgeCurves[0],
          this.state.noseBridgeCurves[1]
        );
        console.log("similarity NoseBridge:", similarityNoseBridge);

        const similarityNoseBot = shapeSimilarity(
          this.state.noseBotCurves[0],
          this.state.noseBotCurves[1]
        );
        console.log("similarity NoseBot:", similarityNoseBot);

        const similarityLEye = shapeSimilarity(
          this.state.lEyeCurves[0],
          this.state.lEyeCurves[1]
        );
        console.log("similarity LEye:", similarityLEye);

        const similarityREye = shapeSimilarity(
          this.state.rEyeCurves[0],
          this.state.rEyeCurves[1]
        );
        console.log("similarity REye:", similarityREye);

        const similarityOMouth = shapeSimilarity(
          this.state.oMouthCurves[0],
          this.state.oMouthCurves[1]
        );
        console.log("similarity OMouth:", similarityOMouth);

        const similarityIMouth = shapeSimilarity(
          this.state.iMouthCurves[0],
          this.state.iMouthCurves[1]
        );
        console.log("similarity i mouth:", similarityIMouth);

        // const averageSimilarity =
        //   (similarityFace +
        //     similarityLEyeBrow +
        //     similarityREyeBrow +
        //     similarityNoseBridge +
        //     similarityNoseBot +
        //     similarityLEye +
        //     similarityREye +
        //     similarityOMouth +
        //     similarityIMouth) /
        //   9;

        const averageSimilarity =
          (similarityFace +
            similarityLEyeBrow +
            similarityREyeBrow +
            similarityOMouth +
            similarityIMouth) /
          5;
        console.log(`Average: averageSimilarity`, averageSimilarity);

        const curvesSim = shapeSimilarity(
          this.state.curves[0],
          this.state.curves[1]
        );
        console.log("similarity whole thing:", curvesSim);
      } else {
        console.log("geen curves in state momenteel");
      }
    };

    return (
      <>
        {" "}
        <div>
          <video
            style={{
              //   position: "absolute",
              top: "0",
              left: "0",
              transform: "scaleX(-1)"
            }}
            id="videoTag"
            ref={this.videoTag}
            width={this.state.constraints.video.width}
            height={this.state.constraints.video.height}
            autoPlay
            muted
          ></video>
          <canvas
            style={{
              //   position: "absolute",
              //   top: "0",
              //   left: "0",
              transform: "scaleX(-1)"
              //   visibility: "hidden"
            }}
            id="myCanvas"
            ref={this.canvasTag}
            width={this.state.constraints.video.width}
            height={this.state.constraints.video.height}
          ></canvas>
          <div style={{ position: "relative" }}>
            {/* <img
              crossorigin="anonymous"
              ref={this.referenceImage}
              src="https://image.freepik.com/free-photo/happy-man-shouting-screaming_23-2148221721.jpg"
            /> */}
            <canvas
              ref={this.referenceCanvasTag}
              width={626}
              height={417}
            ></canvas>
          </div>
        </div>
        <button
          onClick={generateLandmarks}
          style={{
            position: "absolute",
            bottom: "0",
            left: "0"
          }}
        >
          Generate landmarks
        </button>
        <button
          onClick={calculateDistance}
          style={{
            position: "absolute",
            bottom: "0",
            right: "0"
          }}
        >
          Calculate distances
        </button>
      </>
    );
  }
}

export default inject(`store`)(observer(Game));
