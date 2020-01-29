import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  flowStatus = "onboardingEnded";
  //   constructor() {}

  setDetected = () => {
    this.flowStatus = "detectedTrue";
  };

  startGame = () => {
    this.flowStatus = "onboardingEnded";
  };

  resetEverything = () => {
    this.flowStatus = "detectedFalse";
  };
}

decorate(Store, {
  detected: observable,
  setDetected: action,
  resetEverything: action,
  flowStatus: observable,
  startGame: action
});

const store = new Store();

export default store;
