import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  flowStatus = "";
  currentLocation = "";
  imgKortrijk = null;
  imgLille = null;
  imgValenciennes = null;
  imgTournai = null;
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

  setImgKortrijk = img => {
    console.log("set img kortrijk store: ", img);
    this.imgKortrijk = img;
  };
  setImgLille = img => {
    console.log("set img lille store: ", img);
    this.imgLille = img;
  };
  setImgTournai = img => {
    console.log("set img tournai store: ", img);
    this.imgTournai = img;
  };
  setImgValenciennes = img => {
    console.log("set img valenciennes store: ", img);
    this.imgValenciennes = img;
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
  setImgKortrijk: action,
  setImgTournai: action,
  setImgValenciennes: action,
  setImgLille: action,

  flowStatus: observable,
  currentLocation: observable,
  imgKortrijk: observable,
  imgValenciennes: observable,
  imgLille: observable,
  imgTournai: observable
});

const store = new Store();

export default store;
