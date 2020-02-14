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

  resetSortedPlayers = () => {
    this.unsortedPlayers = [];
  };

  resetEverything = () => {
    this.unsortedPlayers = [];
    this.currentRegio = "";
    this.currentPicture = "";
    this.currentScore = "";
    this.currentName = "";
    this.allScores = [];

    this.imgKortrijk = null;
    this.imgLille = null;
    this.imgValenciennes = null;
    this.imgTournai = null;
    this.scoreKortrijk = 0;
    this.scoreLille = 0;
    this.scoreValenciennes = 0;
    this.scoreTournai = 0;
    this.nameKortrijk = "";
    this.nameLille = "";
    this.nameTournai = "";
    this.nameValenciennes = "";
  };

  get sortedPlayers() {
    return this.unsortedPlayers.sort((a, b) => b.score - a.score);
  }

  set sortedPlayers(sortedPlayers) {
    sortedPlayers = sortedPlayers;
  }

  createPlayerArray = regio => {
    console.log("creating player array: ", regio);

    if (regio === "kortrijk") {
      console.log("creating array kortrijk");
      this.unsortedPlayers.push({
        installationLocation: "kortrijk",
        score: this.scoreKortrijk,
        playerName: this.nameKortrijk,
        playerImage: this.imgKortrijk
      });
    }

    if (regio === "lille") {
      console.log("creating array lille");

      this.unsortedPlayers.push({
        installationLocation: "lille",
        score: this.scoreLille,
        playerName: this.nameLille,
        playerImage: this.imgLille
      });
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
    }
  };
}

decorate(Store, {
  setStartOnboarding: action,
  setDetected: action,
  startConnecting: action,
  startGame: action,
  getCalled: action,
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

  unsortedPlayers: observable,
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

  sortedPlayers: computed
});

const store = new Store();

export default store;
