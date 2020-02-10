import React, { Component } from "react";
import styles from "../styles/TouchNameInput.module.css";
import basicStyles from "../styles/Touch.module.css";

import LogoOverlayTablet from "../components/LogoOverlayTablet";

class TouchNameInput extends Component {
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
            <label htmlFor="nameInput" className={styles.label}>
              Naam
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Vul hier jouw naam in"
              id="nameInput"
            />
          </div>
          <input
            className={styles.submit}
            type="submit"
            value="Dit is mijn naam!"
          />
        </form>
      </div>
    );
  }
}

export default TouchNameInput;
