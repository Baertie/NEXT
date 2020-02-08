import React, { Component } from "react";
import styles from "../styles/TouchNameInput.module.css";

class TouchNameInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <form action="">
        <div>
          <label htmlFor="nameInput" className={styles.label}>
            Naam
          </label>
          <input className={styles.input} type="text" />
        </div>
        <input
          className={styles.submit}
          type="submit"
          value="Dit is mijn naam!"
        />
      </form>
    );
  }
}

export default TouchNameInput;
