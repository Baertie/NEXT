import React, { Component } from "react";
import * as faceapi from "face-api.js";

// import { inject, observer } from "mobx-react";
import io from "socket.io-client";
import Loader from "./Loader";

// https://github.com/chanind/curve-matcher
import { shapeSimilarity } from "curve-matcher";
// https://www.npmjs.com/package/stackblur
import stackblur from "stackblur";
import topRedLighten from "../assets/effects/br/topRed-lighten.png";
import topBlackLighten from "../assets/effects/br/topBlack-lighten.png";
import botRedSoft from "../assets/effects/br/botRed-softLight.png";
import botBlackSoft from "../assets/effects/br/botBlack-softLight.png";

import topMagLighten from "../assets/effects/bm/topMag-lighten.png";
import topBlueLighten from "../assets/effects/bm/topBlue-lighten.png";
import botMagSoft from "../assets/effects/bm/botMag-softLight.png";
import botBlueSoft from "../assets/effects/bm/botBlue-softLight.png";

import blackOverlay from "../assets/effects/overlay/blackOverlay.png";
import whiteOverlay from "../assets/effects/overlay/whiteOverlay.png";

// import happyMan from "../assets/referenceImages/happyMan.jpg";
import reference1 from "../assets/referenceImages/reference_1.jpg";
import reference2 from "../assets/referenceImages/reference_2.jpg";
import reference3 from "../assets/referenceImages/reference_3.jpg";

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

import styles from "../styles/Game.module.css";

let socket;

class Game extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    // Extra video's voor css
    this.videoTag2 = React.createRef();
    this.videoTag3 = React.createRef();
    this.videoTag4 = React.createRef();
    this.canvasTag = React.createRef();
    this.referenceImageTag = React.createRef();
    this.referenceCanvasTag = React.createRef();
    this.greyCanvasTag = React.createRef();
    this.blurCanvasTag = React.createRef();

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
      curves: [],
      similarity: null,
      currentRound: 1,
      maxRounds: 3,
      referenceImageArray: [],
      _isLoaded: false,
      hideCanvas: true,
      showScore: false,
      gameTimer: 5,
      roundEnded: false
    };
  }

  componentDidMount() {
    this._isMounted = true;

    // UNCOMMENT TO USE SOCKET
    // if (!socket) {
    //   socket = io(":4000");
    //   //   socket.connect("/");
    // }
    console.log(this.state.constraints);
    console.log(navigator.mediaDevices);
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(
        stream => (this.videoTag.current.srcObject = stream),
        this.loadModels()
      )
      // Extra video's voor css
      .then(stream => (this.videoTag2.current.srcObject = stream))
      .then(stream => (this.videoTag3.current.srcObject = stream))
      .then(stream => (this.videoTag4.current.srcObject = stream))
      .catch(console.log);

    this.setState(state => {
      state.referenceImageArray.push(reference1);
      state.referenceImageArray.push(reference2);
      state.referenceImageArray.push(reference3);
    });

    // INIT SOCKET
    // this.initSocket();
  }

  initSocket = () => {
    socket = io.connect(`/`);
    socket.on(`connect`, () => console.log(socket.id));
    console.log(`direct test zo`);
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
    if (this._isMounted) {
      const canvasTag = this.referenceCanvasTag.current;
      const ctx = canvasTag.getContext("2d");

      const referenceImage = new Image(480, 720);

      referenceImage.onload = async () => {
        faceapi.matchDimensions(canvasTag, referenceImage);

        ctx.drawImage(referenceImage, 0, 0, canvasTag.width, canvasTag.height);

        const useTinyModel = true;
        const detectionsWithLandmarks = await faceapi
          .detectSingleFace(referenceImage)
          .withFaceLandmarks(useTinyModel);

        console.log(detectionsWithLandmarks);

        const landMarkPoints = detectionsWithLandmarks.landmarks.positions;
        const type = "reference";
        this.addPointsToState(landMarkPoints, type);

        faceapi.draw.drawFaceLandmarks(canvasTag, detectionsWithLandmarks);
        this.setState({ _isLoaded: true });
        //console.log("alles geladen");
        // this.startGameTimer();
        this.startGameTimer = setInterval(() => {
          if (!this.state.roundEnded) {
            if (this.state.gameTimer > 0) {
              this.setState({ gameTimer: this.state.gameTimer - 1 });
            } else {
              // TIMER IS 0 GEWORDEN!
              this.screenShot();
              this.setState({ roundEnded: true });
            }
          } else {
            clearInterval(this.startGameTimer);
          }
        }, 1000);
      };

      //referenceImage.crossOrigin = "anonymous";

      referenceImage.src = this.state.referenceImageArray[
        this.state.currentRound - 1
      ];
    }
  };

  screenShot = async () => {
    if (this._isMounted) {
    }

    this.setState({ hideCanvas: false });
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
      const type = "player";
      this.addPointsToState(landMarkPoints, type);

      // const resizedDetections = faceapi.resizeResults(
      //   detectionsWithLandmarks,
      //   displaySize
      // );

      // Draw landmarks on canvas
      //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }

    this.addSharpenEffect(videoTag, canvas, ctx);
    this.addVisualEffects(canvas, ctx);
    this.calculateDistance();
    setTimeout(() => {
      this.setState({ showScore: true });
    }, 2000);
    setTimeout(() => {
      this.clearCreatedCanvas();
      this.goToNextRound();
      this.setState({ roundEnded: false, gameTimer: 5 });
    }, 5000);
  };

  clearCreatedCanvas = () => {
    this.setState({ hideCanvas: true, showScore: false });
  };

  addSharpenEffect = (image, canvas, ctx) => {
    // https://medium.com/skylar-salernos-tech-blog/mimicking-googles-pop-filter-using-canvas-blend-modes-d7da83590d1a
    const greyCanvas = this.greyCanvasTag.current;
    const blurCanvas = this.blurCanvasTag.current;

    const greyContext = greyCanvas.getContext("2d");
    const blurContext = blurCanvas.getContext("2d");

    // Draw the image on the canvas
    greyContext.drawImage(image, 0, 0, greyCanvas.width, greyCanvas.height);

    //Convert the image to black and white
    greyContext.globalCompositeOperation = "color";
    greyContext.fillStyle = "Gray";
    greyContext.fillRect(0, 0, greyCanvas.width, greyCanvas.height);

    // Create a copy
    blurCanvas.width = greyCanvas.width / 4;
    blurCanvas.height = greyCanvas.height / 4;
    blurContext.drawImage(
      greyCanvas,
      0,
      0,
      blurCanvas.width,
      blurCanvas.height
    );

    // Blur the copy
    stackblur(blurCanvas, blurCanvas.width, blurCanvas.height, 10);

    // Invert the blurred image
    blurContext.globalCompositeOperation = "difference";
    blurContext.fillStyle = "white";
    blurContext.fillRect(0, 0, blurCanvas.width, blurCanvas.height);

    // Create Mask
    greyContext.globalCompositeOperation = "source-over";
    greyContext.globalAlpha = 0.5;
    greyContext.drawImage(
      blurCanvas,
      0,
      0,
      greyCanvas.width,
      greyCanvas.height
    );
    greyContext.globalAlpha = 1;

    /// draw original image to a third canvas

    ctx.globalAlpha = 1;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    //overlay it on the original -do it twice for extra strength
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(greyCanvas, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(greyCanvas, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over";
  };

  addVisualEffects = (canvas, ctx) => {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    let botBlueSoftImg = new Image();
    let botMagSoftImg = new Image();
    let topBlueLightenImg = new Image();
    let topMagLightenImg = new Image();

    let whiteOverlayImg = new Image();

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

    whiteOverlayImg.onload = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(whiteOverlayImg, 0, 0, canvas.width, canvas.height);
    };

    botBlueSoftImg.src = botBlueSoft;
    botMagSoftImg.src = botMagSoft;
    topBlueLightenImg.src = topBlueLighten;
    topMagLightenImg.src = topMagLighten;
    whiteOverlayImg.src = whiteOverlay;

    console.log(topMagLightenImg);
    console.log(whiteOverlayImg);
  };

  addPointsToState = (points, type) => {
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
    if (type === "player") {
      this.setState(state => {
        state.curves[1] = points;
        state.faceCurves[1] = faceCurveArr;
        state.lEyebrowCurves[1] = lEyebrowCurveArr;
        state.rEyebrowCurves[1] = rEyebrowCurveArr;
        state.noseBridgeCurves[1] = noseBridgeCurveArr;
        state.noseBotCurves[1] = noseBotCurveArr;
        state.lEyeCurves[1] = lEyeCurveArr;
        state.rEyeCurves[1] = rEyeCurveArr;
        state.oMouthCurves[1] = oMouthCurveArr;
        state.iMouthCurves[1] = iMouthCurveArr;
      });
    }

    if (type === "reference") {
      this.setState(state => {
        state.curves[0] = points;
        state.faceCurves[0] = faceCurveArr;
        state.lEyebrowCurves[0] = lEyebrowCurveArr;
        state.rEyebrowCurves[0] = rEyebrowCurveArr;
        state.noseBridgeCurves[0] = noseBridgeCurveArr;
        state.noseBotCurves[0] = noseBotCurveArr;
        state.lEyeCurves[0] = lEyeCurveArr;
        state.rEyeCurves[0] = rEyeCurveArr;
        state.oMouthCurves[0] = oMouthCurveArr;
        state.iMouthCurves[0] = iMouthCurveArr;
      });
    }

    // this.setState(state => {
    //   state.curves.push(points);
    //   state.faceCurves.push(faceCurveArr);
    //   state.lEyebrowCurves.push(lEyebrowCurveArr);
    //   state.rEyebrowCurves.push(rEyebrowCurveArr);
    //   state.noseBridgeCurves.push(noseBridgeCurveArr);
    //   state.noseBotCurves.push(noseBotCurveArr);
    //   state.lEyeCurves.push(lEyeCurveArr);
    //   state.rEyeCurves.push(rEyeCurveArr);
    //   state.oMouthCurves.push(oMouthCurveArr);
    //   state.iMouthCurves.push(iMouthCurveArr);
    // });
  };

  calculateDistance = () => {
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
        ((similarityFace +
          similarityLEyeBrow +
          similarityREyeBrow +
          similarityOMouth +
          similarityIMouth) /
          5) *
        100;
      console.log(`Average: averageSimilarity`, averageSimilarity);
      this.setState({ similarity: averageSimilarity });

      const curvesSim = shapeSimilarity(
        this.state.curves[0],
        this.state.curves[1]
      );
      console.log("similarity whole thing:", curvesSim);
    } else {
      console.log("geen curves in state momenteel");
    }
  };

  goToNextRound = () => {
    this.setState(prevState => {
      return {
        currentRound: prevState.currentRound + 1
      };
    });

    this.getReferenceData();
  };

  render() {
    const { store } = this.props;
    if (this.state.currentRound > 3) {
      console.log("STOP");
      // store.setGameEnded();
      // Eerst nog score die je krijgt tonen, daarna (na x seconden) scorebord
    }

    return (
      <>
        {!this.state._isLoaded ? <Loader /> : null}
        <div
          style={{ display: !this.state._isLoaded ? "none" : "" }}
          className={styles.full_game_wrapper}
        >
          <div className={styles.red_background}></div>
          <div className={styles.logo_next_white}></div>
          <div className={styles.game_top_view}>
            <div className={styles.search_timer}>
              <div className={styles.search_timer_text}>
                {this.state.gameTimer}
              </div>
              <svg className={styles.timer_svg}>
                <circle
                  className={styles.timer_circle}
                  r="40"
                  cx="50"
                  cy="50"
                ></circle>
              </svg>
            </div>
            <div className={styles.game_round}>
              <p className={styles.game_round_top}>Ronde</p>
              <p className={styles.game_round_bot}>
                {this.state.currentRound}/3
              </p>
            </div>
          </div>
          <div className={styles.game_wrapper}>
            {/* <img
              crossorigin="anonymous"
              ref={this.referenceImage}
              src="https://image.freepik.com/free-photo/happy-man-shouting-screaming_23-2148221721.jpg"
            /> */}
            <div className={styles.game_top}>
              <div>
                <div className={styles.poster_top}>
                  <p className={styles.poster_text}>Uit te beelden</p>
                </div>
                <canvas
                  ref={this.referenceCanvasTag}
                  width={480}
                  height={720}
                ></canvas>
              </div>
              <div>
                <div className={styles.player_top}>
                  <p className={styles.own_name}>{/*INSERT NAAM*/}Wout (jij)</p>
                  <div className={styles.player_score}>{/*INSERT SCORE*/}0</div>
                </div>
                <div className={styles.own_video_wrapper}>
                  <video
                    className={styles.own_video_feed}
                    style={{ transform: "scaleX(-1)" }}
                    id="videoTag"
                    ref={this.videoTag}
                    width={this.state.constraints.video.width}
                    height={this.state.constraints.video.height}
                    autoPlay
                    muted
                  ></video>
                  <div
                    className={
                      this.state.showScore
                        ? styles.score_added_wrapper
                        : styles.score_added_wrapper_hide
                    }
                  >
                    <p className={styles.round_score}>
                      {/* CHECK ALS GEEN OUTLINES, BASISSCORE? */}+{" "}
                      {Math.round(this.state.similarity)}
                    </p>
                  </div>
                  <p
                    className={
                      `${styles.location_tag} ${styles.location_tag_1}` /*INSERT LOCATIE TAG VOOR KLEUR*/
                    }
                  >
                    Kortrijk{/*INSERT LOCATIE*/}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.game_bottom}>
              <div className={styles.oponent_wrapper}>
                <div className={styles.player_top}>
                  <p className={styles.oponent_name}>
                    {/*INSERT NAAM*/} Tegenstander lange naam bro
                  </p>
                  <div className={styles.player_score}>{/*INSERT SCORE*/}0</div>
                </div>
                <div className={styles.player_video_wrapper}>
                  <video
                    style={{ transform: "scaleX(-1)" }}
                    className={styles.oponent_video_feed}
                    id="videoTag2"
                    ref={this.videoTag2}
                    width={this.state.constraints.video.width}
                    height={this.state.constraints.video.height}
                    autoPlay
                    muted
                  ></video>
                  <p
                    className={
                      `${styles.location_tag} ${styles.location_tag_2}` /*INSERT LOCATIE TAG VOOR KLEUR*/
                    }
                  >
                    Kortrijk{/*INSERT LOCATIE*/}
                  </p>
                </div>
              </div>
              <div className={styles.oponent_wrapper}>
                <div className={styles.player_top}>
                  <p className={styles.oponent_name}>
                    {/*INSERT NAAM*/} Tegenstander
                  </p>
                  <div className={styles.player_score}>{/*INSERT SCORE*/}0</div>
                </div>
                <div className={styles.player_video_wrapper}>
                  <video
                    style={{ transform: "scaleX(-1)" }}
                    className={styles.oponent_video_feed}
                    id="videoTag3"
                    ref={this.videoTag3}
                    width={this.state.constraints.video.width}
                    height={this.state.constraints.video.height}
                    autoPlay
                    muted
                  ></video>
                  <p
                    className={
                      `${styles.location_tag} ${styles.location_tag_3}` /*INSERT LOCATIE TAG VOOR KLEUR*/
                    }
                  >
                    Kortrijk{/*INSERT LOCATIE*/}
                  </p>
                </div>
              </div>
              <div className={styles.oponent_wrapper}>
                <div className={styles.player_top}>
                  <p className={styles.oponent_name}>
                    {/*INSERT NAAM*/} Tegenstander
                  </p>
                  <div className={styles.player_score}>{/*INSERT SCORE*/}0</div>
                </div>
                <div className={styles.player_video_wrapper}>
                  <video
                    style={{ transform: "scaleX(-1)" }}
                    className={styles.oponent_video_feed}
                    id="videoTag4"
                    ref={this.videoTag4}
                    width={this.state.constraints.video.width}
                    height={this.state.constraints.video.height}
                    autoPlay
                    muted
                  ></video>
                  <p
                    className={
                      `${styles.location_tag} ${styles.location_tag_4}` /*INSERT LOCATIE TAG VOOR KLEUR*/
                    }
                  >
                    Kortrijk{/*INSERT LOCATIE*/}
                  </p>
                </div>
              </div>
            </div>
            <canvas
              style={{
                //   position: "absolute",
                //   top: "0",
                //   left: "0",
                transform: "scaleX(-1)"
              }}
              className={
                !this.state.hideCanvas
                  ? styles.own_poster
                  : styles.hide_own_poster
              }
              id="myCanvas"
              ref={this.canvasTag}
              width={this.state.constraints.video.width}
              height={this.state.constraints.video.height}
            ></canvas>
            <div style={{ display: "none" }}>
              <canvas
                style={{
                  transform: "scaleX(-1)",
                  display: "none"
                }}
                id="greyCanvas"
                ref={this.greyCanvasTag}
                width={this.state.constraints.video.width}
                height={this.state.constraints.video.height}
              ></canvas>
              <canvas
                style={{
                  transform: "scaleX(-1)",
                  display: "none"
                }}
                id="blurCanvas"
                ref={this.blurCanvasTag}
                width={this.state.constraints.video.width}
                height={this.state.constraints.video.height}
              ></canvas>
            </div>
          </div>
        </div>

        {/* <button
          onClick={calculateDistance}
          style={{
            position: "absolute",
            bottom: "0",
            right: "0"
          }}
        >
          Calculate distances
        </button> */}
      </>
    );
  }
}

// export default inject(`store`)(observer(Game));
export default Game;
