import { decorate, observable, configure, action, runInAction } from "mobx";
import Api from "../api";
import Score from "../models/Score";

configure({ enforceActions: `observed` });

class Store {
  constructor() {
    this.api = new Api(`scores`);
    this.getAll();

    console.log("store");
  }
  flowStatus = "";
  currentLocation = "";
  scores = [];

  // flowStatus = "Socket";
  //   constructor() {}

  setStartOnboarding = () => {
    this.flowStatus = "onboardingStarted";
  };
  setDetected = () => {
    this.flowStatus = "startScreensaver";
  };
  startConnecting = () => {
    this.flowStatus = "onboardingEnded";
  };
  startGame = () => {
    this.flowStatus = "startGame";
  };
  getCalled = () => {
    this.flowStatus = "calledUser";
  };
  resetEverything = () => {
    this.flowStatus = "detectedFalse";
  };
  setGameEnded = () => {
    this.flowStatus = "gameEnded";
  };
  startSocket = () => {
    this.flowStatus = "Socket";
  };
  setLocation = location => {
    console.log(location);
    this.currentLocation = location;
  };

  getAll = () => {
    console.log("in get all");
    this.api.getAll().then(d => d.forEach(this.addScoresToArray));
    // this.api.getAll().then(d => d.forEach(console.log(d)));
    // console.log("api", this.api.getAll());
    //this.api.getAll().then(d => console.log("api data", d));
    // this.api.getAll().then(d => console.log(d));

    console.log("na get all");
  };

  addScoresToArray = data => {
    console.log("in add", data);
    this.scores.push(data);
    console.log(this.scores);
  };

  // addScoresToArray = values => {
  //   const score = new Score();
  //   score.updateFromServer(values);
  //   runInAction(() => this.scores.push(score));
  //   console.log("dit werkt");
  // };
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

  flowStatus: observable,
  currentLocation: observable
});

const store = new Store();

export default store;
