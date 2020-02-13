import React, { Component } from "react";
import TouchBackground from "../components/TouchBackground.jsx";

import styles from "../styles/TouchConnecting.module.css";
import basicStyles from "../styles/Touch.module.css";

import { socket } from "../App.js";

class TouchConnecting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTimer: 30
    };
  }

  componentDidMount() {
    socket.on("searchTimer", timer => {
      this.setState({ searchTimer: timer });
    });
  }
  render() {
    return (
      <div className={basicStyles.container}>
        <TouchBackground />
        <button className={styles.backbutton}>annuleren</button>
        <div className={styles.timerContainer}>
          <p className={styles.bodytext}>Tegenstanders aan het zoeken...</p>
          <div className={styles.timer}>{this.state.searchTimer}</div>
        </div>
      </div>
    );
  }
}

export default TouchConnecting;
