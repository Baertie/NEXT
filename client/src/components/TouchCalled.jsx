import React, { Component } from "react";
import styles from "../styles/TouchCalled.module.css";
import basicStyles from "../styles/Touch.module.css";
import LogoOverlayTablet from "../components/LogoOverlayTablet";
import { socket } from "../App";
import { inject, observer } from "mobx-react";

class TouchCalled extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: "30"
    };
  }

  componentDidMount() {
    socket.on("searchTimer", timer => {
      this.setState({ timer: timer });
    });
  }

  handleStartClick = () => {
    socket.emit("banaan");
    console.log("start game emit");
  };

  componentWillUnmount() {}
  render() {
    return (
      <div className={`${basicStyles.container} ${styles.container}`}>
        <LogoOverlayTablet />

        <div className={styles.timer}>{this.state.timer}</div>
        <button className={styles.button} onClick={this.handleStartClick}>
          start de game
        </button>
      </div>
    );
  }
}

export default inject(`store`)(observer(TouchCalled));
