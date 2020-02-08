import React, { Component } from "react";
import TouchBackground from "../components/TouchBackground.jsx";
import styles from "../styles/TouchGameTimer.module.css";
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
      this.setState({ gameTimer: timer });
    });
  }
  render() {
    return (
      <div className={basicStyles.container}>
        <TouchBackground />
        {/* <p>De game start binnen</p> */}
        <div>{this.state.gameTimer}</div>
      </div>
    );
  }
}

export default TouchGameTimer;
