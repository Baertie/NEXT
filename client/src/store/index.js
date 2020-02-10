import { decorate, observable, configure, action } from "mobx";
import Api from "../api";
import Score from "../models/Score";

configure({ enforceActions: `observed` });

class Store {
  constructor() {
    this.api = new Api(`score`);
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
    this.api.getAll().then(d => d.forEach(this.addScoresToArray));
  };

  addScoresToArray = data => {
    this.scores.push(data);
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

  flowStatus: observable,
  currentLocation: observable
});

const store = new Store();

export default store;
