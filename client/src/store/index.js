import {
  decorate,
  observable,
  configure,
  action,
  computed,
  runInAction,
  toJS
} from "mobx";
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
  allScores = [];
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
  nameKortrijk = "";
  nameLille = "";
  nameTournai = "";
  nameValenciennes = "";
  unsortedPlayers = [];
  calculatedPosition = 0;
  // sortedPlayers = [];
  // regioIds = [
  //   { location: "kortrijk", _id: "5e42bba51c9d440000a9126e" },
  //   { location: "lille", _id: "5e42bbba1c9d440000a9126f" },
  //   { location: "tournai", _id: "5e42bbc61c9d440000a91270" },
  //   { location: "valenciennes", _id: "5e42bbdc1c9d440000a91271" }
  // ];

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
  setName = name => {
    console.log(name);
    this.currentName = name;
  };
  setScore = score => {
    console.log(score);
    this.currentScore = score;
  };

  getAll = () => {
    this.api.getAll().then(d => d.forEach(this.addAllScoresToArray));
    this.calculatePosition();
  };

  calculatePosition = () => {
    // haal eigen score op, kijk op welke index alle scores het staat
    console.log("calculate position");
    console.log(this.allScores);
    let currentPosition = this.allScores.indexOf(this.currentPicture);
    console.log(currentPosition);

    this.calculatedPosition = currentPosition + 1;
    // let findRegio = this.regioScores.find(
    //   o => o.regio === this.currentLocation
    // );
  };

  getLimited = () => {
    this.scores = [];
    this.api.getLimited(5).then(d => d.forEach(this.addScoresToArray));
  };

  addScoresToArray = data => {
    this.scores.push(data);
  };

  addAllScoresToArray = data => {
    this.allScores.push(data);
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
      .then(scoreValues => newScore.updateFromServer(scoreValues))
      .then(this.getLimited())
      .then(this.getAll());

    this.updateRegioScore();
  };

  getRegioScores = () => {
    this.regioScores = [];
    this.regioApi.getAll().then(d => d.forEach(this.addRegioScoresToArray));
  };

  addRegioScoresToArray = data => {
    this.regioScores.push(data);
    console.log(this.regioScores);
  };

  // Regio model
  // kortrijkScore = {
  //   _id: "5e42bba51c9d440000a9126e",
  //   regio: "kortrijk",
  //   score: "10000"
  // };

  updateRegioScore = () => {
    let findRegio = this.regioScores.find(
      o => o.regio === this.currentLocation
    );
    let regioToUpdate = toJS(findRegio);

    console.log(regioToUpdate);

    console.log("score", regioToUpdate.score);

    let newScore = regioToUpdate.score + this.currentScore;
    regioToUpdate.score = newScore;
    console.log("new score", regioToUpdate.score);

    // let findInArray = regioIds.find(o => o.location === regio);
    // let regioId = findInArray._id;

    // let newScore = this.currentScore + currentRegioScore;

    // this.regioScore._id = regioId;
    // this.regioScore.regio = regio;
    // this.regioScore.score = newScore;

    let data = regioToUpdate;
    console.log("data log", regioToUpdate);
    const newRegioscore = new Regioscore();
    newRegioscore.updateFromServer(data);

    this.regioApi
      .update(newRegioscore)
      .then(scoreValues => newRegioscore.updateFromServer(scoreValues))
      .then(this.getRegioScores());
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

  setScoreKortrijk = (score, round) => {
    this.scoreKortrijk = score;
    if (round === 3) {
      this.createPlayerArray("kortrijk");
    }
  };
  setScoreLille = (score, round) => {
    this.scoreLille = score;
    if (round === 3) {
      this.createPlayerArray("lille");
    }
  };
  setScoreTournai = (score, round) => {
    this.scoreTournai = score;
    if (round === 3) {
      this.createPlayerArray("tournai");
    }
  };
  setScoreValenciennes = (score, round) => {
    this.scoreValenciennes = score;
    if (round === 3) {
      this.createPlayerArray("valenciennes");
    }
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

  // setSortedScores = () => {
  //   // this.setState({
  //   // observableArray.replace(observableArray.slice().sort());
  //   this.sortedPlayers = this.unsortedPlayers.sort((a, b) => {
  //     return b.score - a.score;
  //   });
  //   // });
  // };

  resetSortedPlayers = () => {
    this.sortedPlayers = [];
  };

  get sortedPlayers() {
    return this.unsortedPlayers.sort((a, b) => b.score - a.score);
  }

  set sortedPlayers(sortedPlayers) {
    sortedPlayers = sortedPlayers;
  }

  createPlayerArray = regio => {
    console.log("creating player array: ", regio);
    // sortedScores = [
    //   { installationLocation: "kortrijk", score: 210 },
    //   { installationLocation: "valenciennes", score: 230 },
    //   { installationLocation: "tournai", score: 180 },
    //   { installationLocation: "lille", score: 30 }
    // ];

    if (regio === "kortrijk") {
      console.log("creating array kortrijk");
      this.unsortedPlayers.push({
        installationLocation: "kortrijk",
        score: this.scoreKortrijk,
        playerName: this.nameKortrijk,
        playerImage: this.imgKortrijk
      });
      // this.setSortedScores();
    }

    if (regio === "lille") {
      console.log("creating array lille");

      this.unsortedPlayers.push({
        installationLocation: "lille",
        score: this.scoreLille,
        playerName: this.nameLille,
        playerImage: this.imgLille
      });
      // this.setSortedScores();
    }

    if (regio === "tournai") {
      console.log("creating array tournai");

      this.unsortedPlayers.push({
        installationLocation: "tournai",
        score: this.scoreTournai,
        playerName: this.nameTournai,
        playerImage: this.imgTournai
      });
      // this.setSortedScores();
    }

    if (regio === "valenciennes") {
      console.log("creating array valenciennes");

      this.unsortedPlayers.push({
        installationLocation: "valenciennes",
        score: this.scoreValenciennes,
        playerName: this.nameValenciennes,
        playerImage: this.imgValenciennes
      });
      // this.setSortedScores();
    }
    // this.unsortedPlayers = [
    //   ,
    //   ,
    //   ,

    // ];
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
  setScore: action,
  setName: action,
  setPicture: action,
  updateRegioScore: action,
  createPlayerArray: action,
  getRegioScores: action,
  calculatePosition: action,
  resetSortedPlayers: action,

  // flowStatus: observable,
  unsortedPlayers: observable,
  allPlayers: observable,
  // sortedPlayers: observable,
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
  // setSortedScores: action,

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
  // sortedScores: observable,

  sortedPlayers: computed
});

const store = new Store();

export default store;
