import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 0
    };
  }
  handleResetClick = e => {
    console.log("reset");
    this.props.store.resetEverything();
  };

  handleNextClick = () => {
    console.log("next");
    if (this.state.screen < 2) {
      this.setState({ screen: this.state.screen + 1 });
    }
  };

  handlePrevClick = () => {
    console.log("prev");
    if (this.state.screen > 0) {
      this.setState({ screen: this.state.screen - 1 });
    }
  };

  handleStartClick = () => {
    console.log("start verbinden man");
    this.props.store.startGame();
  };

  render() {
    switch (this.state.screen) {
      case 0:
        return (
          <>
            <p>Scherm 1</p>
            <button onClick={this.handlePrevClick}>Previous step</button>
            <button onClick={this.handleNextClick}>Next step</button>
          </>
        );
      case 1:
        return (
          <>
            <p>Scherm 2</p>
            <button onClick={this.handlePrevClick}>Previous step</button>
            <button onClick={this.handleNextClick}>Next step</button>
          </>
        );
      case 2:
        return (
          <>
            <p>Scherm 3</p>
            <button onClick={this.handlePrevClick}>Previous step</button>
            <button onClick={this.handleStartClick}>START GAME!</button>
          </>
        );
    }
    // return (
    //   <>
    //     <p>Onboarding welkom</p>

    //     <p>
    //       Test:{" "}
    //       {() => {
    //         switch (this.state.screen) {
    //           case 0:
    //             return <p>Scherm 0</p>;
    //           case 1:
    //             return <p>Scherm 1</p>;
    //           case 2:
    //             return <p>Scherm 2</p>;
    //           default:
    //             return <p>Help</p>;
    //         }
    //       }}
    //     </p>
    //     <button onClick={this.handleResetClick}>Reset</button>
    //   </>
    // );
  }
}

export default inject(`store`)(observer(Onboarding));
