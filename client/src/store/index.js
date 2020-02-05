import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  flowStatus = "calledUser";
  // flowStatus = "Socket";
  //   constructor() {}

  setStartOnboarding = () => {
    this.flowStatus = "onboardingStarted";
  };
  setDetected = () => {
    this.flowStatus = "startScreensaver";
  };
  startGame = () => {
    this.flowStatus = "onboardingEnded";
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
}

decorate(Store, {
  setStartOnboarding: action,
  setDetected: action,
  startGame: action,
  getCalled: action,
  resetEverything: action,
  setGameEnded: action,

  detected: observable,
  flowStatus: observable
});

const store = new Store();

export default store;
