import React, { Component } from "react";
import TouchBackground from "../components/TouchBackground.jsx";
import styles from "../styles/TouchConnecting.module.css";
import basicStyles from "../styles/Touch.module.css";

import { socket } from "../App.js";

class TouchGameTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTimer: 5
    };
  }

  componentDidMount() {
    socket.on("gameTimer", timer => {
      console.log("gametimer");
      this.setState({ gameTimer: timer });
    });
  }

  render() {
    return (
      <div className={basicStyles.container}>
        <TouchBackground />
        <div className={styles.timerContainer}>
          <div className={styles.timer}>{this.state.gameTimer}</div>
        </div>
      </div>
    );
  }
}

export default TouchGameTimer;
