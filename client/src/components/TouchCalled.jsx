import React, { Component } from "react";
import styles from "../styles/TouchCalled.module.css";
import basicStyles from "../styles/Touch.module.css";
import LogoOverlayTablet from "../components/LogoOverlayTablet";

class TouchCalled extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: "30"
    };
  }
  render() {
    return (
      <div className={`${basicStyles.container} ${styles.container}`}>
        <LogoOverlayTablet />

        <div className={styles.timer}>{this.state.timer}</div>
        <button className={styles.button} onClick={this.handlePrevClick}>
          start de game
        </button>
      </div>
    );
  }
}

export default TouchCalled;
