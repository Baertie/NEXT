import React, { Component } from "react";
import Arrow from "../assets/img/pijl.svg";

import styles from "../styles/NameOverlay.module.css";
import { socket } from "../App";

class NameOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValue: ""
    };
  }

  componentDidMount() {
    socket.on("namechange", namevalue => {
      console.log("iemand uit ", namevalue);
      this.setState({ nameValue: namevalue });
    });
  }
  render() {
    return (
      <div className={styles.full_wrapper}>
        <div className={styles.component_wrapper}>
          <div className={styles.overlay}>
            {/* <h2 className={styles.overlay_title}>Wat is jouw naam?</h2> */}
            <h2 className={styles.overlay_title}>
              {this.state.nameValue.length > 0
                ? this.state.nameValue
                : "Wat is jouw naam?"}
            </h2>
            <p className={styles.overlay_text}>
              {this.state.nameValue.length > 0
                ? `welkom, ${this.state.nameValue}`
                : " Geef jouw naam in op het scherm hieronder om verder te gaan."}
            </p>
          </div>
          <img className={styles.arrow} src={Arrow} />
        </div>
      </div>
    );
  }
}

export default NameOverlay;
