import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  flowStatus = "startGame";
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
}

decorate(Store, {
  setStartOnboarding: action,
  setDetected: action,
  startConnecting: action,
  startGame: action,
  getCalled: action,
  resetEverything: action,
  setGameEnded: action,

  detected: observable,
  flowStatus: observable
});

const store = new Store();

export default store;
