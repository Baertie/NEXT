import React, { Component } from "react";
import * as faceapi from "face-api.js";

import { inject, observer } from "mobx-react";
import Loader from "./Loader";
import CallOnboarding from "./CallOnboarding";
import GameTutorial from "./GameTutorial";
import NameOverlay from "./NameOverlay";
import TeamBoard from "./TeamBoard";

// https://github.com/chanind/curve-matcher
import { shapeSimilarity } from "curve-matcher";
// https://www.npmjs.com/package/stackblur
import stackblur from "stackblur";
// import topRedLighten from "../assets/effects/br/topRed-lighten.png";
// import topBlackLighten from "../assets/effects/br/topBlack-lighten.png";
// import botRedSoft from "../assets/effects/br/botRed-softLight.png";
// import botBlackSoft from "../assets/effects/br/botBlack-softLight.png";

import topMagLighten from "../assets/effects/bm/topMag-lighten.png";
import topBlueLighten from "../assets/effects/bm/topBlue-lighten.png";
import botMagSoft from "../assets/effects/bm/botMag-softLight.png";
import botBlueSoft from "../assets/effects/bm/botBlue-softLight.png";

// import blackOverlay from "../assets/effects/overlay/blackOverlay.png";
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
import basicStyles from "../styles/Touch.module.css";

import { socket } from "../App.js";

class Game extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.videoTag = React.createRef();
    this.imgTag1 = React.createRef();
    this.imgTag2 = React.createRef();
    this.imgTag3 = React.createRef();
    this.canvasTag = React.createRef();
    this.referenceImageTag = React.createRef();
    this.referenceCanvasTag = React.createRef();
    this.greyCanvasTag = React.createRef();
    this.blurCanvasTag = React.createRef();

    this.state = {
      video: null,
      constraints: {
        audio: false,
        video: { width: 480, height: 720 }
      },
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
      onboardingTimer: 15,
      tutorialTimer: 3,
      roundEnded: false,
      ownLocation: this.props.store.currentLocation,
      ownScore: 0,
      ownName: "",
      kortrijkImg: null,
      tournaiImg: null,
      lilleImg: null,
      valenciennesImg: null,

      kortrijkName: "",
      tournaiName: "",
      lilleName: "",
      valenciennesName: "",
      onboardingEnded: false,

      player2img: null,
      player3img: null,
      player4img: null,

      player2Location: null,
      player3Location: null,
      player4Location: null,

      player2name: "",
      player3name: "",
      player4name: "",

      // render variables 3 screens
      startTutorial: false,
      startSecondTutorial: false,
      inputName: true,
      gameEnded: false,

      player2score: 0,
      player3score: 0,
      player4score: 0,

      showTimer: false
    };
  }

  componentDidMount() {
    this._isMounted = true;

    console.log(
      "this.props.store.currentLocation",
      this.props.store.currentLocation
    );

    this.props.store.resetSortedPlayers();

    // console.log(this.state.constraints);
    // console.log(navigator.mediaDevices);
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(
        stream => (this.videoTag.current.srcObject = stream),
        this.loadModels()
      )
      .catch(console.log);

    this.getOponentImg();

    this.setState(state => {
      state.referenceImageArray.push(reference1);
      state.referenceImageArray.push(reference2);
      state.referenceImageArray.push(reference3);
    });

    socket.on("imgKortrijk", img => {
      this.setRoundImg(img, "kortrijk");
    });
    socket.on("imgTournai", img => {
      this.setRoundImg(img, "tournai");
    });
    socket.on("imgLille", img => {
      this.setRoundImg(img, "lille");
    });
    socket.on("imgValenciennes", img => {
      this.setRoundImg(img, "valenciennes");
    });

    // socket.on("setNameKortrijk", name => {
    //   console.log("setNameKortrijk", name);
    //   if (name === "") {
    //     this.props.store.setNameKortrijk("NEXTER");
    //   } else {
    //     this.props.store.setNameKortrijk(name);
    //   }
    // });
    // socket.on("setNameLille", name => {
    //   console.log("setNameLille", name);
    //   if (name === "") {
    //     this.props.store.setNameLille("NEXTER");
    //   } else {
    //     this.props.store.setNameLille(name);
    //   }
    // });
    // socket.on("setNameTournai", name => {
    //   console.log("setNameTournai", name);
    //   if (name === "") {
    //     this.props.store.setNameTournai("NEXTER");
    //   } else {
    //     this.props.store.setNameTournai(name);
    //   }
    // });
    // socket.on("setNameValenciennes", name => {
    //   console.log("setNameValenciennes", name);
    //   if (name === "") {
    //     this.props.store.setNameValenciennes("NEXTER");
    //   } else {
    //     this.props.store.setNameValenciennes(name);
    //   }
    // });

    socket.on("setNameKortrijk", name => {
      console.log("setNameKortrijk", name);

      this.props.store.setNameKortrijk(name);
    });
    socket.on("setNameLille", name => {
      console.log("setNameLille", name);

      this.props.store.setNameLille(name);
    });
    socket.on("setNameTournai", name => {
      console.log("setNameTournai", name);

      this.props.store.setNameTournai(name);
    });
    socket.on("setNameValenciennes", name => {
      console.log("setNameValenciennes", name);

      this.props.store.setNameValenciennes(name);
    });

    socket.on("gametutorial", () => {
      this.getOwnName();
      console.log("tutorial triggeren");
      this.setState({ startTutorial: true });
      this.setState({ inputName: false });
    });

    socket.on("startOnboardingTimer", () => {
      // socket.emit("game");
      socket.emit("startTabletTimer");
      console.log("startOnboardingTimer letsgo");
      this.setState({ showTimer: true });
      this.startOnboardingTimer();
      this.getOwnName();
    });

    socket.emit("nameinput");

    socket.on("startSecondTutorialTimer", () => {
      this.setState({
        startTutorial: false,
        startSecondTutorial: true
      });
    });

    // this,setState
    socket.on("scoreKortrijk", score => {
      this.props.store.setScoreKortrijk(score, this.state.currentRound);
      this.setRoundScore(score, "kortrijk");
      console.log("score kortrijk ontvangen");
    });
    socket.on("scoreTournai", score => {
      this.props.store.setScoreTournai(score, this.state.currentRound);
      this.setRoundScore(score, "tournai");
      console.log("score tournai ontvangen");
    });
    socket.on("scoreLille", score => {
      this.props.store.setScoreLille(score, this.state.currentRound);
      this.setRoundScore(score, "lille");
      console.log("score lille ontvangen");
    });
    socket.on("scoreValenciennes", score => {
      this.props.store.setScoreValenciennes(score, this.state.currentRound);
      this.setRoundScore(score, "valenciennes");
      console.log("score valenciennes ontvangen");
    });

    socket.on("setRegio", regio => {
      this.props.store.setRegio(regio);
      socket.emit("gdpr");
    });

    socket.on("addtodatabase", () => {
      this.props.store.addPlayerScoreToDatabase();
      socket.emit("leaderboard");
      this.props.history.push("/scoreboard");
    });
  }

  // INIT SOCKET
  // this.initSocket();

  setRoundScore = (score, location) => {
    // score en loc
    switch (location) {
      case "kortrijk":
        if (
          this.state.player2Location === location &&
          this.state.player2score != null
        ) {
          this.setState({ player2score: score });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3score != null
        ) {
          this.setState({ player3score: score });
          break;
        } else if (
          this.state.player4Location === location &&
          this.state.player4score != null
        ) {
          this.setState({ player4score: score });
          break;
        }
      case "tournai":
        if (
          this.state.player2Location === location &&
          this.state.player2score != null
        ) {
          this.setState({ player2score: score });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3score != null
        ) {
          this.setState({ player3score: score });
          break;
        } else if (
          this.state.player4Location === location &&
          this.state.player4score != null
        ) {
          this.setState({
            player4score: score
          });
          break;
        }
      case "lille":
        if (
          this.state.player2Location === location &&
          this.state.player2score != null
        ) {
          this.setState({ player2score: score });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3score != null
        ) {
          this.setState({ player3score: score });
          break;
        } else if (
          this.state.player4Location === location &&
          this.state.player4score != null
        ) {
          this.setState({
            player4score: score
          });
          break;
        }
      case "valenciennes":
        if (
          this.state.player2Location === location &&
          this.state.player2score != null
        ) {
          this.setState({ player2score: score });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3score != null
        ) {
          this.setState({ player3score: score });
          break;
        } else if (
          this.state.player4Location === location &&
          this.state.player4score != null
        ) {
          this.setState({
            player4score: score
          });
          break;
        }
    }
  };
  setRoundImg = (img, location) => {
    // img en loc
    switch (location) {
      case "kortrijk":
        if (
          this.state.player2Location === location &&
          this.state.player2img != null
        ) {
          this.setState({ player2img: img });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3img != null
        ) {
          this.setState({ player3img: img });
          break;
        } else if (this.state.player4img != null) {
          this.setState({ player4img: img });
          break;
        }
      case "tournai":
        if (
          this.state.player2Location === location &&
          this.state.player2img != null
        ) {
          this.setState({ player2img: img });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3img != null
        ) {
          this.setState({ player3img: img });
          break;
        } else if (this.state.player4img != null) {
          this.setState({ player4img: img });
          break;
        }
      case "lille":
        if (
          this.state.player2Location === location &&
          this.state.player2img != null
        ) {
          this.setState({ player2img: img });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3img != null
        ) {
          this.setState({ player3img: img });
          break;
        } else if (this.state.player4img != null) {
          this.setState({ player4img: img });
          break;
        }
      case "valenciennes":
        if (
          this.state.player2Location === location &&
          this.state.player2img != null
        ) {
          this.setState({ player2img: img });
          break;
        } else if (
          this.state.player3Location === location &&
          this.state.player3img != null
        ) {
          this.setState({ player3img: img });
          break;
        } else if (this.state.player4img != null) {
          this.setState({ player4img: img });
          break;
        }
    }
  };

  getOponentNames = () => {
    let players = 0;
    let locations = [];

    console.log("nameKortrijk", this.props.store.nameKortrijk);
    console.log("nameLille", this.props.store.nameLille);
    console.log("nameTournai", this.props.store.nameTournai);
    console.log("nameValenciennes", this.props.store.nameValenciennes);

    // if (this.props.store.nameKortrijk === "") {
    //   this.props.store.nameKortrijk = "NEXTER";
    // }
    // if (this.props.store.nameTournai === "") {
    //   this.props.store.nameTournai = "NEXTER";
    // }
    // if (this.props.store.nameLille === "") {
    //   this.props.store.nameLille = "NEXTER";
    // }
    // if (this.props.store.nameValenciennes === "") {
    //   this.props.store.nameValenciennes = "NEXTER";
    // }

    if (
      this.props.store.nameKortrijk !== "" &&
      this.props.store.currentLocation !== "kortrijk"
    ) {
      console.log("add kortrijk");
      this.setState({ kortrijkName: this.props.store.nameKortrijk });
      players++;
      locations.push("kortrijk");
    }
    if (
      this.props.store.nameTournai !== "" &&
      this.props.store.currentLocation !== "tournai"
    ) {
      console.log("add tournai");
      this.setState({ tournaiName: this.props.store.nameTournai });
      players++;
      locations.push("tournai");
    }
    if (
      this.props.store.nameLille !== "" &&
      this.props.store.currentLocation !== "lille"
    ) {
      console.log("add lille");
      this.setState({ lilleName: this.props.store.nameLille });
      players++;
      locations.push("lille");
    }
    if (
      this.props.store.nameValenciennes !== "" &&
      this.props.store.currentLocation !== "valenciennes"
    ) {
      console.log("add valencienens");
      this.setState({ valenciennesName: this.props.store.nameValenciennes });
      players++;
      locations.push("valenciennes");
    }

    let player2NameFree = true;
    let player3NameFree = true;

    for (let index = 0; index < players; index++) {
      const locationToAdd = locations[index];
      switch (locationToAdd) {
        case "kortrijk":
          if (player2NameFree) {
            console.log("kortrijk naam player 2");
            this.setState({
              player2name: this.props.store.nameKortrijk
            });
            player2NameFree = false;
            break;
          } else if (player3NameFree) {
            console.log("kortrijk naam player 3");
            this.setState({
              player3name: this.props.store.nameKortrijk
            });
            player3NameFree = false;
            break;
          } else {
            console.log("kortrijk naam player 4");
            this.setState({
              player4name: this.props.store.nameKortrijk
            });
            break;
          }

        case "tournai":
          if (player2NameFree) {
            console.log("tournai naam player 2");
            this.setState({
              player2name: this.props.store.nameTournai
            });
            player2NameFree = false;
            break;
          } else if (player3NameFree) {
            console.log("tournai naam player 3");
            this.setState({
              player3name: this.props.store.nameTournai
            });
            player3NameFree = false;
            break;
          } else {
            console.log("tournai naam player 4");
            this.setState({
              player4name: this.props.store.nameTournai
            });
            break;
          }

        case "lille":
          if (player2NameFree) {
            console.log("lille naam player 2");
            this.setState({
              player2name: this.props.store.nameLille
            });
            player2NameFree = false;
            break;
          } else if (player3NameFree) {
            console.log("lille naam player 3");
            this.setState({
              player3name: this.props.store.nameLille
            });
            player3NameFree = false;
            break;
          } else {
            console.log("lille naam player 4");
            this.setState({
              player4name: this.props.store.nameLille
            });
            break;
          }

        case "valenciennes":
          if (player2NameFree) {
            console.log("valenciennes naam player 2");
            this.setState({
              player2name: this.props.store.nameValenciennes
            });
            player2NameFree = false;
            break;
          } else if (player3NameFree) {
            console.log("valenciennes naam player 3");
            this.setState({
              player3name: this.props.store.nameValenciennes
            });
            player3NameFree = false;
            break;
          } else {
            console.log("valenciennes naam player 4");
            this.setState({
              player4name: this.props.store.nameValenciennes
            });
            break;
          }
      }
    }
  };

  getOwnName = () => {
    // if (this.props.store.nameKortrijk === "") {
    //   this.props.store.nameKortrijk = "NEXTER";
    // }
    // if (this.props.store.nameTournai === "") {
    //   this.props.store.nameTournai = "NEXTER";
    // }
    // if (this.props.store.nameLille === "") {
    //   this.props.store.nameLille = "NEXTER";
    // }
    // if (this.props.store.nameValenciennes === "") {
    //   this.props.store.nameValenciennes = "NEXTER";
    // }

    switch (this.state.ownLocation) {
      case "kortrijk":
        console.log("set own name");
        this.setState({ ownName: this.props.store.nameKortrijk });
        this.props.store.setName(this.props.store.nameKortrijk);
        break;
      case "lille":
        console.log("set own name");
        this.setState({ ownName: this.props.store.nameLille });
        this.props.store.setName(this.props.store.nameLille);
        break;
      case "tournai":
        console.log("set own name");
        this.setState({ ownName: this.props.store.nameTournai });
        this.props.store.setName(this.props.store.nameTournai);
        break;
      case "valenciennes":
        console.log("set own name");
        this.setState({ ownName: this.props.store.nameValenciennes });
        this.props.store.setName(this.props.store.nameValenciennes);
        break;
    }
  };

  getOponentImg = () => {
    let players = 0;
    let locations = [];

    if (
      this.props.store.imgKortrijk !== null &&
      this.props.store.currentLocation !== "kortrijk"
    ) {
      this.setState({ kortrijkImg: this.props.store.imgKortrijk });
      players++;
      locations.push("kortrijk");
    }
    if (
      this.props.store.imgTournai !== null &&
      this.props.store.currentLocation !== "tournai"
    ) {
      this.setState({ tournaiImg: this.props.store.imgTournai });
      players++;
      locations.push("tournai");
    }
    if (
      this.props.store.imgLille !== null &&
      this.props.store.currentLocation !== "lille"
    ) {
      this.setState({ lilleImg: this.props.store.imgLille });
      players++;
      locations.push("lille");
    }
    if (
      this.props.store.imgValenciennes !== null &&
      this.props.store.currentLocation !== "valenciennes"
    ) {
      this.setState({ valenciennesImg: this.props.store.imgValenciennes });
      players++;
      locations.push("valenciennes");
    }

    let player2imgFree = true;
    let player3imgFree = true;

    for (let index = 0; index < players; index++) {
      const locationToAdd = locations[index];
      switch (locationToAdd) {
        case "kortrijk":
          if (player2imgFree && this.state.player2img === null) {
            this.setState({
              player2img: this.props.store.imgKortrijk,
              player2Location: "kortrijk"
            });

            player2imgFree = false;
            break;
          } else if (player3imgFree && this.state.player3img === null) {
            this.setState({
              player3img: this.props.store.imgKortrijk,
              player3Location: "kortrijk"
            });

            player3imgFree = false;
            break;
          } else {
            this.setState({
              player4img: this.props.store.imgKortrijk,
              player4Location: "kortrijk"
            });

            break;
          }

        case "tournai":
          if (player2imgFree && this.state.player2img === null) {
            this.setState({
              player2img: this.props.store.imgTournai,
              player2Location: "tournai"
            });

            player2imgFree = false;
            break;
          } else if (player3imgFree && this.state.player3img === null) {
            this.setState({
              player3img: this.props.store.imgTournai,
              player3Location: "tournai"
            });

            player3imgFree = false;
            break;
          } else {
            this.setState({
              player4img: this.props.store.imgTournai,
              player4Location: "tournai"
            });

            break;
          }

        case "lille":
          if (player2imgFree && this.state.player2img === null) {
            this.setState({
              player2img: this.props.store.imgLille,
              player2Location: "lille"
            });

            player2imgFree = false;
            break;
          } else if (player3imgFree && this.state.player3img === null) {
            this.setState({
              player3img: this.props.store.imgLille,
              player3Location: "lille"
            });

            player3imgFree = false;
            break;
          } else {
            this.setState({
              player4img: this.props.store.imgLille,
              player4Location: "lille"
            });

            break;
          }

        case "valenciennes":
          if (player2imgFree) {
            this.setState({
              player2img: this.props.store.imgValenciennes,
              player2Location: "valenciennes"
            });

            player2imgFree = false;

            break;
          } else if (player3imgFree) {
            this.setState({
              player3img: this.props.store.imgValenciennes,
              player3Location: "valenciennes"
            });

            player3imgFree = false;
            break;
          } else {
            this.setState({
              player4img: this.props.store.imgValenciennes,
              player4Location: "valenciennes"
            });

            break;
          }
      }
    }
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

        // console.log(detectionsWithLandmarks);

        const landMarkPoints = detectionsWithLandmarks.landmarks.positions;
        const type = "reference";
        this.addPointsToState(landMarkPoints, type);

        // faceapi.draw.drawFaceLandmarks(canvasTag, detectionsWithLandmarks);
        this.setState({ _isLoaded: true });
        //console.log("alles geladen");
      };

      //referenceImage.crossOrigin = "anonymous";

      referenceImage.src = this.state.referenceImageArray[
        this.state.currentRound - 1
      ];
    }
  };

  startGameTimer = () => {
    // this.clearInterval(this.onboardingTimer);
    // clearInterval(this.onboardintTimer);
    if (!this.state.gameEnded) {
      this.gameTimer = setInterval(() => {
        if (!this.state.roundEnded) {
          if (this.state.gameTimer > 0) {
            this.setState({ gameTimer: this.state.gameTimer - 1 });
            socket.emit("gameTimer", this.state.gameTimer);
          } else {
            // TIMER IS 0 GEWORDEN!
            this.screenShot();
            this.setState({ roundEnded: true });
          }
        } else {
          if (this.state.currentRound === 4) {
            clearInterval(this.gameTimer);
          }
        }
      }, 1000);
    }
  };

  startOnboardingTimer = () => {
    this.onboardingTimer = setInterval(() => {
      if (this.state.onboardingTimer > 0) {
        this.setState({ onboardingTimer: this.state.onboardingTimer - 1 });
        socket.emit("onboardingTimer", this.state.onboardingTimer);
      } else {
        this.setState({ startTutorial: false, startSecondTutorial: true });
        clearInterval(this.onboardingTimer);
        this.getOponentNames();
        // this.getOwnName();
        this.startTutorialTimer();
      }
    }, 1000);
  };

  startTutorialTimer = () => {
    this.tutorialTimer = setInterval(() => {
      if (this.state.tutorialTimer > 0) {
        this.setState({ tutorialTimer: this.state.tutorialTimer - 1 });
        socket.emit("tutorialTimer", this.state.tutorialTimer);
      } else {
        this.setState({ startSecondTutorial: false, onboardingEnded: true });
        clearInterval(this.tutorialTimer);
        socket.emit("game");
        this.startGameTimer();
      }
    }, 1000);
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
    }

    // MARK

    // this.addSharpenEffect(videoTag, canvas, ctx);
    this.addVisualEffects(canvas, ctx);
    this.calculateDistance();

    switch (this.props.store.currentLocation) {
      case "kortrijk":
        socket.emit("imgKortrijk", canvas.toDataURL());
        break;
      case "tournai":
        socket.emit("imgTournai", canvas.toDataURL());
        break;
      case "lille":
        socket.emit("imgLille", canvas.toDataURL());
        break;
      case "valenciennes":
        socket.emit("imgValenciennes", canvas.toDataURL());
        break;
    }

    setTimeout(() => {
      this.setState({ showScore: true });
    }, 2000);
    //

    if (this.state.currentRound === this.state.maxRounds) {
      console.log("game gedaan in setTimeout");
      // this.props.store.createPlayerArray();
      this.props.store.setScore(this.state.ownScore);
      this.setState({ gameEnded: true });
    }

    // MARK
    setTimeout(() => {
      if (this.state.currentRound === this.state.maxRounds) {
        console.log("game gedaan in setTimeout");
      } else {
        this.clearCreatedCanvas();
        this.goToNextRound();
        this.setState({
          roundEnded: false,
          gameTimer: 5
        });
      }
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

    // console.log(topMagLightenImg);
    // console.log(whiteOverlayImg);
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
      // console.log("similarity face:", similarityFace);

      const similarityLEyeBrow = shapeSimilarity(
        this.state.lEyebrowCurves[0],
        this.state.lEyebrowCurves[1]
      );
      // console.log("similarity LEyeBrow:", similarityLEyeBrow);

      const similarityREyeBrow = shapeSimilarity(
        this.state.rEyebrowCurves[0],
        this.state.rEyebrowCurves[1]
      );
      // console.log("similarity REyeBrow:", similarityREyeBrow);

      const similarityNoseBridge = shapeSimilarity(
        this.state.noseBridgeCurves[0],
        this.state.noseBridgeCurves[1]
      );
      // console.log("similarity NoseBridge:", similarityNoseBridge);

      const similarityNoseBot = shapeSimilarity(
        this.state.noseBotCurves[0],
        this.state.noseBotCurves[1]
      );
      // console.log("similarity NoseBot:", similarityNoseBot);

      const similarityLEye = shapeSimilarity(
        this.state.lEyeCurves[0],
        this.state.lEyeCurves[1]
      );
      // console.log("similarity LEye:", similarityLEye);

      const similarityREye = shapeSimilarity(
        this.state.rEyeCurves[0],
        this.state.rEyeCurves[1]
      );
      // console.log("similarity REye:", similarityREye);

      const similarityOMouth = shapeSimilarity(
        this.state.oMouthCurves[0],
        this.state.oMouthCurves[1]
      );
      // console.log("similarity OMouth:", similarityOMouth);

      const similarityIMouth = shapeSimilarity(
        this.state.iMouthCurves[0],
        this.state.iMouthCurves[1]
      );
      // console.log("similarity i mouth:", similarityIMouth);

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

      let playerScore = this.mapScore(averageSimilarity, 0.7, 1, 0, 1.5);
      playerScore = Math.round(playerScore * 100);
      this.setState({
        similarity: playerScore,
        ownScore: this.state.ownScore + playerScore
      });

      switch (this.state.ownLocation) {
        case "kortrijk":
          console.log("emit score kortrijk:", this.state.ownScore);
          socket.emit("scoreKortrijk", this.state.ownScore);
          this.props.store.setScoreKortrijk(
            this.state.ownScore,
            this.state.currentRound
          );
          break;
        case "tournai":
          console.log("emit score tournai:", this.state.ownScore);
          socket.emit("scoreTournai", this.state.ownScore);
          this.props.store.setScoreTournai(
            this.state.ownScore,
            this.state.currentRound
          );
          break;
        case "lille":
          console.log("emit score lille:", this.state.ownScore);
          socket.emit("scoreLille", this.state.ownScore);
          this.props.store.setScoreLille(
            this.state.ownScore,
            this.state.currentRound
          );

          break;
        case "valenciennes":
          console.log("emit score valenciennes:", this.state.ownScore);
          socket.emit("scoreValencienness", this.state.ownScore);
          this.props.store.setScoreValenciennes(
            this.state.ownScore,
            this.state.currentRound
          );
          break;
      }

      // const curvesSim = shapeSimilarity(
      //   this.state.curves[0],
      //   this.state.curves[1]
      // );
      // console.log("similarity whole thing:", curvesSim);
    } else {
      console.log("geen curves in state momenteel");
    }
  };

  mapScore = (num, in_min, in_max, out_min, out_max) => {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  goToNextRound = () => {
    if (!this.state.gameEnded) {
      if (this.state.currentRound === this.state.maxRounds) {
        console.log("game gedaan");
        this.setState({ gameEnded: true });
        clearInterval(this.gameTimer);
      } else {
        this.setState(prevState => {
          return {
            currentRound: prevState.currentRound + 1
          };
        });
        this.getReferenceData();
      }

      //     if (this.state.currentRound === this.state.maxRounds) {
      //       console.log("game gedaan");
      //       // this.setState({ gameEnded: true });
      //       // this.props.store.createPlayerArray();
      //     } else {
      //       this.setState(prevState => {
      //         return {
      //           currentRound: prevState.currentRound + 1
      //         };
      //       });

      //       this.getReferenceData();
    }
  };

  render() {
    // const { store } = this.props;
    // if (this.state.currentRound > this.state.maxRounds) {
    //   console.log("STOP");
    // store.setGameEnded();
    // socket.emit("regioinput");
    // Eerst nog score die je krijgt tonen, daarna (na x seconden) scorebord
    // }

    return (
      <>
        {/* {!this.state._isLoaded ? <Loader /> : null}
        <div
          style={{ display: !this.state._isLoaded ? "none" : "" }}
          className={styles.full_game_wrapper}
        > */}
        <div className={`${styles.full_game_wrapper} ${basicStyles.container}`}>
          {this.state.inputName ? <NameOverlay /> : null}

          {this.state.startTutorial ? (
            <CallOnboarding />
          ) : this.state.startSecondTutorial ? (
            <GameTutorial />
          ) : null}
          {this.state.gameEnded ? <TeamBoard /> : null}

          {/* <CallOnboarding /> */}
          <div className={styles.red_background}></div>
          <div className={styles.logo_next_white}></div>
          <div className={styles.game_top_view}>
            {/* <div className={styles.search_timer}>
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
            </div> */}
            <div className={styles.game_timer}>
              {this.state.gameEnded ? null : this.state.showTimer ? (
                this.state.ownName === "" ? null : (
                  <>
                    <div className={styles.game_timer_text}>
                      {!this.state.startTutorial
                        ? !this.state.startSecondTutorial
                          ? this.state.gameTimer
                          : this.state.tutorialTimer
                        : this.state.onboardingTimer}
                    </div>

                    {/* <div className={styles.timer_wrapper}>
                      <div className={styles.timer_dot}></div>
                      <div className={styles.timer_dot}></div>
                      <div className={styles.timer_dot}></div>
                      <div className={styles.timer_dot}></div>
                      <div className={styles.timer_dot}></div>
                      <div className={styles.timer_dot}></div>
                    </div> */}
                  </>
                )
              ) : null}
            </div>
            {this.state.onboardingEnded ? (
              <div className={styles.game_round}>
                <p className={styles.game_round_top}>Ronde</p>
                <p className={styles.game_round_bot}>
                  {this.state.currentRound}/3
                </p>
              </div>
            ) : null}
          </div>
          <div className={styles.game_wrapper} id="App">
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
                  <p className={styles.own_name}>{this.state.ownName} (jij)</p>
                  <div className={styles.player_score}>
                    {this.state.ownScore}
                  </div>
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
                    className={`${styles.location_tag} ${
                      styles[this.state.ownLocation]
                    }`}
                  >
                    {this.state.ownLocation}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.game_bottom}>
              <div className={styles.oponent_wrapper}>
                {this.state.player2img !== null ? (
                  <>
                    {" "}
                    <div className={styles.player_top}>
                      <p className={styles.oponent_name}>
                        {this.state.player2name}
                      </p>
                      <div className={styles.player_score}>
                        {this.state.player2score}
                      </div>
                    </div>
                    <div className={styles.player_video_wrapper}>
                      <img
                        src={this.state.player2img}
                        alt="Player 2"
                        className={styles.oponent_img}
                      />
                      <p
                        className={`${styles.location_tag} ${
                          styles[this.state.player2Location]
                        }`}
                      >
                        {this.state.player2Location}
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
              <div className={styles.oponent_wrapper}>
                {this.state.player3img !== null ? (
                  <>
                    {" "}
                    <div className={styles.player_top}>
                      <p className={styles.oponent_name}>
                        {this.state.player3name}
                      </p>
                      <div className={styles.player_score}>
                        {this.state.player3score}
                      </div>
                    </div>
                    <div className={styles.player_video_wrapper}>
                      <img
                        src={this.state.player3img}
                        alt="Player 3"
                        ref={this.imgTag2}
                        className={styles.oponent_img}
                      />
                      <p
                        className={`${styles.location_tag} ${
                          styles[this.state.player3Location]
                        }`}
                      >
                        {this.state.player3Location}
                      </p>
                    </div>
                  </>
                ) : null}{" "}
              </div>
              <div className={styles.oponent_wrapper}>
                {this.state.player4img !== null ? (
                  <>
                    <div className={styles.player_top}>
                      <p className={styles.oponent_name}>
                        {this.state.player4name}
                      </p>
                      <div className={styles.player_score}>
                        {this.state.player4score}
                      </div>
                    </div>
                    <div className={styles.player_video_wrapper}>
                      <img
                        src={this.state.player4img}
                        alt="Player 4"
                        className={styles.oponent_img}
                      />
                      <p
                        className={`${styles.location_tag} ${
                          styles[this.state.player4Location]
                        }`}
                      >
                        {this.state.player4Location}
                      </p>
                    </div>
                  </>
                ) : null}{" "}
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

export default inject(`store`)(observer(Game));
// export default Game;
