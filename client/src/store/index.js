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
  currentLocation = "kortrijk";
  imgKortrijk = null;
  imgLille = null;
  imgValenciennes = null;
  imgTournai = null;
  scoreKortrijk = 0;
  scoreLille = 0;
  scoreValenciennes = 0;
  scoreTournai = 0;
  nameKortrijk = "";
  nameLille = "";
  nameTournai = "";
  nameValenciennes = "";

  // sortedScores = [
  //   { installationLocation: "kortrijk", score: 210 },
  //   { installationLocation: "valenciennes", score: 230 },
  //   { installationLocation: "tournai", score: 180 },
  //   { installationLocation: "lille", score: 30 }
  // ];

  // Regio model
  // kortrijkScore = {
  //   _id: "5e42bba51c9d440000a9126e",
  //   regio: "kortrijk",
  //   score: "10000"
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

  setNameKortrijk = name => {
    console.log("set name Kortrijk", name);
    this.nameKortrijk = name;
  };
  setNameLille = name => {
    console.log("set name Lille", name);
    this.nameLille = name;
  };
  setNameTournai = name => {
    console.log("set name Tournai", name);
    this.nameTournai = name;
  };
  setNameValenciennes = name => {
    console.log("set name Valenciennes", name);
    this.nameValenciennes = name;
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

  setNameKortrijk: action,
  setNameTournai: action,
  setNameValenciennes: action,
  setNameLille: action,
  setSortedScores: action,

  imgKortrijk: observable,
  imgValenciennes: observable,
  imgLille: observable,
  imgTournai: observable,
  scoreKortrijk: observable,
  scoreValenciennes: observable,
  scoreLille: observable,
  scoreTournai: observable,
  nameKortrijk: observable,
  nameValenciennes: observable,
  nameLille: observable,
  nameTournai: observable,
  sortedScores: observable
});

const store = new Store();

export default store;
