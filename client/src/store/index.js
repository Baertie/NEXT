import { decorate, observable, configure, action } from "mobx";

configure({ enforceActions: `observed` });

class Store {
  detected = false;
  //   constructor() {}

  setDetected = value => {
    console.log("dikke test");
    this.detected = value;
  };

  resetEverything = () => {
    this.detected = false;
  };
}

decorate(Store, {
  detected: observable,
  setDetected: action,
  resetEverything: action
});

const store = new Store();

export default store;
