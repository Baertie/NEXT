import { decorate, observable, action, computed } from "mobx";

class Regioscore {
  constructor(regio, score, id) {
    this.id = id;
    this.regio = regio;
    this.score = score;
  }

  setRegio = value => {
    this.regio = value;
  };

  setScore = value => {
    this.score = value;
  };

  updateId = value => {
    this.id = value;
  };

  updateFromServer = values => {
    this.setRegio(values.regio);
    this.setScore(values.score);
    this.updateId(values._id);
  };

  get values() {
    return {
      regio: this.regio,
      score: this.score
    };
  }
}

decorate(Regioscore, {
  id: observable,
  regio: observable,
  score: observable,

  setRegio: action,
  setScore: action,
  updateId: action,

  values: computed
});

export default Regioscore;
