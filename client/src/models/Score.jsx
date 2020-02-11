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
    // this.answers = answers;
  }

  //   setQuestion = value => {
  //     this.question = value;
  //   };

  //   setAnswers = value => (this.answers = value);

  //   updateFromServer = values => {
  //     this.setQuestion(values.question);
  //     this.setAnswers(values.answers);
  //   };

  //   get values() {
  //     return { question: this.question, answers: this.answers };
  //   }
}

// decorate(Answer, {
//   question: observable,
//   answers: observable,
//   setQuestion: action,
//   setAnswers: action,
//   values: computed
// });

export default Score;
