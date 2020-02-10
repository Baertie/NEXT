import React, { Component } from "react";
import styles from "../styles/TouchNameInput.module.css";
import basicStyles from "../styles/Touch.module.css";

import LogoOverlayTablet from "../components/LogoOverlayTablet";

class TouchRegioInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={basicStyles.container}>
        <LogoOverlayTablet />
        <form action="" className={styles.formContainer}>
          <div className={styles.inputContainer}>
            <label htmlFor="regioInput" className={styles.label}>
              Regio
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Vul hier jouw regio in"
              id="regioInput"
            />
          </div>
          <input className={styles.submit} type="submit" value="Toevoegen" />
        </form>
      </div>
    );
  }
}

export default TouchRegioInput;
