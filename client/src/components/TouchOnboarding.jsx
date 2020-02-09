import React, { Component } from "react";
import { socket } from "../App";

import styles from "../styles/TouchOnboarding.module.css";
import basicStyles from "../styles/Touch.module.css";
import LogoOverlayTablet from "../components/LogoOverlayTablet";

class TouchOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 0
    };
  }

  handleNextClick = () => {
    console.log("next");
    if (this.state.screen < 2) {
      this.setState({ screen: this.state.screen + 1 });

      socket.emit("nextOnboardingPage");
    } else {
      socket.emit("startGame");
    }
  };

  handlePrevClick = () => {
    console.log("prev");
    if (this.state.screen > 0) {
      this.setState({ screen: this.state.screen - 1 });

      socket.emit("prevOnboardingPage");
    }
  };

  render() {
    return (
      <div className={`${basicStyles.container} ${styles.container}`}>
        <LogoOverlayTablet />
        {/* <LanguageSelector /> */}
        <button
          className={`${styles.button} ${styles.prevButton}`}
          onClick={this.handlePrevClick}
        >
          terug
        </button>
        <button
          className={`${styles.button} ${styles.nextButton}`}
          onClick={this.handleNextClick}
        >
          {this.state.screen < 2 ? "volgende" : "start de game"}
        </button>
      </div>
    );
  }
}

export default TouchOnboarding;
