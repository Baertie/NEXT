import { decorate, observable, action, computed } from "mobx";

class Score {
  constructor(score) {
    this.score = score;
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
