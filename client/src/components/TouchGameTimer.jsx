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
    // socket.on("onboardingTimer", timer => {
    //   console.log("onboardingtimer");
    //   this.setState({ gameTimer: timer });
    // });
    // socket.on("tutorialTimer", timer => {
    //   console.log("tutorialtimer");
    //   this.setState({ gameTimer: timer });
    // });

    // socket.on("startTabletTimer", () => {
    //   this.timer = setInterval(() => {
    //     if (this.state.timer > 0) {
    //       this.setState({ timer: this.state.timer - 1 });
    //     } else {
    //       clearInterval(this.timer);
    //     }
    //   }, 1000);
    // });
  }

  render() {
    return (
      <div className={basicStyles.container}>
        <TouchBackground />
        <div className={styles.timerContainer}>
          {/* <p className={styles.bodytext}>De game start over</p> */}
          <div className={styles.timer}>{this.state.gameTimer}</div>
        </div>
      </div>
    );
  }
}

export default TouchGameTimer;
