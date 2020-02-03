import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  flowStatus = "";
  // flowStatus = "Socket";
  //   constructor() {}

  setStartOnboarding = () => {
    this.flowStatus = "startOnboarding";
  };

  setDetected = () => {
    this.flowStatus = "startScreensaver";
  };

  startGame = () => {
    this.flowStatus = "onboardingEnded";
  };

  resetEverything = () => {
    this.flowStatus = "detectedFalse";
  };
  setGameEnded = () => {
    this.flowStatus = "gameEnded";
  };
}

decorate(Store, {
  detected: observable,
  setDetected: action,
  resetEverything: action,
  setStartOnboarding: action,
  flowStatus: observable,
  startGame: action,
  setGameEnded: action
});

const store = new Store();

export default store;
