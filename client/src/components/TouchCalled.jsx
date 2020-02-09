import React, { Component } from "react";
import styles from "../styles/TouchCalled.module.css";

class TouchCalled extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: "30"
    };
  }
  render() {
    return (
      <div className={styles.container}>
        <div>{this.state.timer}</div>
        <button className={styles.button} onClick={this.handlePrevClick}>
          start de game
        </button>
      </div>
    );
  }
}

export default TouchCalled;
