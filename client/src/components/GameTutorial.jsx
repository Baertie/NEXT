import React, { Component } from "react";

import styles from "../styles/GameTutorial.module.css";

class GameTutorial extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.gridWrapper}>
        <div className={styles.textWrapper1}>
          {" "}
          <p className={styles.textItem1}>De affiche</p>
        </div>
        <div className={styles.textWrapper2}>
          {" "}
          <p className={styles.textItem2}>Dit ben jij</p>
        </div>
        <div className={styles.textWrapper3}>
          {" "}
          <p className={styles.textItem3}>Dit zijn jouw tegenstanders</p>
        </div>
      </div>
    );
  }
}
export default GameTutorial;
