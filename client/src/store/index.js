import { decorate, observable, configure, action, runInAction } from "mobx";
import Api from "../api";
import Score from "../models/Score";
import Regioscore from "../models/Regioscore";

configure({ enforceActions: `observed` });

class Store {
  constructor() {
    this.api = new Api(`scores`);
    this.regioApi = new Api(`regioscores`);
    this.getLimited();
    this.getRegioScores();
    // this.updateRegioScore("kortrijk");
  }
  currentRegio = "";
  currentPicture = "";
  currentScore = "";
  currentName = "";
  scores = [];
  regioScores = [];
  currentLocation = "";
  imgKortrijk = null;
  imgLille = null;
  imgValenciennes = null;
  imgTournai = null;
  // flowStatus = "Socket";
  //   constructor() {}

  // Regio model
  // kortrijkScore = {
  //   _id: "5e42bba51c9d440000a9126e",
  //   regio: "kortrijk",
  //   score: "10000"
  // };

  // setStartOnboarding = () => {
  //   this.flowStatus = "onboardingStarted";
  // };
  // setDetected = () => {
  //   this.flowStatus = "startScreensaver";
  // };
  // startConnecting = () => {
  //   this.flowStatus = "onboardingEnded";
  // };
  // startGame = () => {
  //   this.flowStatus = "startGame";
  // };
  // getCalled = () => {
  //   this.flowStatus = "calledUser";
  // };
  // resetEverything = () => {
  //   this.flowStatus = "detectedFalse";
  // };
  // setGameEnded = () => {
  //   this.flowStatus = "gameEnded";
  // };
  // startSocket = () => {
  //   this.flowStatus = "Socket";
  // };
  setLocation = location => {
    console.log(location);
    this.currentLocation = location;
  };
  setRegio = regio => {
    console.log(regio);
    this.currentRegio = regio;
  };
  setPicture = picture => {
    console.log(picture);
    this.currentPicture = picture;
  };

  getAll = () => {
    //this.api.getAll().then(d => d.forEach(this.addScoresToArray));
  };

  getLimited = () => {
    this.api.getLimited(5).then(d => d.forEach(this.addScoresToArray));
  };

  addScoresToArray = data => {
    this.scores.push(data);
  };

  addPlayerScoreToDatabase = () => {
    let data = {
      playerName: this.currentName,
      playerRegion: this.currentRegio,
      playerPicture: this.currentPicture,
      playerScore: this.currentScore,
      installationLocation: this.currentLocation
    };
    const newScore = new Score();
    newScore.updateFromServer(data);

    this.api
      .create(newScore)
      .then(scoreValues => newScore.updateFromServer(scoreValues));
  };

  getRegioScores = () => {
    this.regioApi.getAll().then(d => d.forEach(this.addRegioScoresToArray));
  };

  addRegioScoresToArray = data => {
    this.regioScores.push(data);
    console.log(this.regioScores);
  };

  updateRegioScore = regio => {
    console.log(regio);

    let data = this.kortrijkScore;
    const newRegioscore = new Regioscore();
    newRegioscore.updateFromServer(data);

    this.regioApi
      .update(newRegioscore)
      .then(scoreValues => newRegioscore.updateFromServer(scoreValues));
  };

  setImgKortrijk = img => {
    console.log("set img kortrijk store: ", img);
    this.imgKortrijk = img;
  };
  setImgLille = img => {
    console.log("set img lille store: ", img);
    this.imgLille = img;
  };
  setImgTournai = img => {
    console.log("set img tournai store: ", img);
    this.imgTournai = img;
  };
  setImgValenciennes = img => {
    console.log("set img valenciennes store: ", img);
    this.imgValenciennes = img;
  };
}

decorate(Store, {
  setStartOnboarding: action,
  setDetected: action,
  startConnecting: action,
  startGame: action,
  getCalled: action,
  resetEverything: action,
  setGameEnded: action,
  startSocket: action,
  setLocation: action,
  addScoresToArray: action,
  addRegioScoresToArray: action,
  setRegio: action,
  updateRegioScore: action,

  // flowStatus: observable,
  currentLocation: observable,
  currentRegio: observable,
  currentPicture: observable,
  currentName: observable,
  currentScore: observable,
  scores: observable,
  regioScores: observable,
  setImgKortrijk: action,
  setImgTournai: action,
  setImgValenciennes: action,
  setImgLille: action,

  imgKortrijk: observable,
  imgValenciennes: observable,
  imgLille: observable,
  imgTournai: observable
});

const store = new Store();

export default store;
