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
  scoreKortrijk = 0;
  scoreLille = 0;
  scoreValenciennes = 0;
  scoreTournai = 0;

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
    this.imgKortrijk = img;
  };
  setImgLille = img => {
    this.imgLille = img;
  };
  setImgTournai = img => {
    this.imgTournai = img;
  };
  setImgValenciennes = img => {
    this.imgValenciennes = img;
  };

  setScoreKortrijk = score => {
    this.scoreKortrijk = score;
  };
  setScoreLille = score => {
    this.scoreLille = score;
  };
  setScoreTournai = score => {
    this.scoreTournai = score;
  };
  setScoreValenciennes = score => {
    this.scoreValenciennes = score;
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
  setScoreKortrijk: action,
  setScoreTournai: action,
  setScoreValenciennes: action,
  setScoreLille: action,

  imgKortrijk: observable,
  imgValenciennes: observable,
  imgLille: observable,
  imgTournai: observable,
  scoreKortrijk: observable,
  scoreValenciennes: observable,
  scoreLille: observable,
  scoreTournai: observable
});

const store = new Store();

export default store;
