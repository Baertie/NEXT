import { decorate, observable, action, computed } from "mobx";

class Score {
  constructor(
    playerName,
    playerRegion,
    playerPicture,
    playerScore,
    installationLocation
  ) {
    this.playerName = playerName;
    this.playerRegion = playerRegion;
    this.playerPicture = playerPicture;
    this.playerScore = playerScore;
    this.installationLocation = installationLocation;
  }

  setName = value => {
    this.playerName = value;
  };

  setRegion = value => {
    this.playerRegion = value;
  };
  setPicture = value => {
    this.playerPicture = value;
  };
  setScore = value => {
    this.playerScore = value;
  };
  setLocation = value => {
    this.installationLocation = value;
  };

  updateFromServer = values => {
    this.setName(values.playerName);
    this.setRegion(values.playerRegion);
    this.setPicture(values.playerPicture);
    this.setScore(values.playerScore);
    this.setLocation(values.installationLocation);
  };

  get values() {
    return {
      playerName: this.playerName,
      playerRegion: this.playerRegion,
      playerPicture: this.playerPicture,
      playerScore: this.playerScore,
      installationLocation: this.installationLocation
    };
  }
}

decorate(Score, {
  playerName: observable,
  playerRegion: observable,
  playerPicture: observable,
  playerScore: observable,
  installationLocation: observable,
  setName: action,
  setRegion: action,
  setPicture: action,
  setScore: action,
  setLocation: action,
  values: computed
});

export default Score;
