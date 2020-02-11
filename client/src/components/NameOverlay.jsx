import React, { Component } from "react";
import Arrow from "../assets/img/pijl.svg";

import styles from "../styles/NameOverlay.module.css";

class NameOverlay extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.full_wrapper}>
        <div className={styles.component_wrapper}>
          <div className={styles.overlay}>
            <h2 className={styles.overlay_title}>Wat is jouw naam?</h2>
            <p className={styles.overlay_text}>
              Geef jouw naam in op het scherm hieronder om verder te gaan.
            </p>
          </div>
          <img className={styles.arrow} src={Arrow} />
        </div>
      </div>
    );
  }
}

export default NameOverlay;
