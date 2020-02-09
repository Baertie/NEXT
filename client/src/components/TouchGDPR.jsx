import React, { Component } from "react";
import styles from "../styles/TouchGDPR.module.css";

class TouchGDPR extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.container}>
        <div>
          <p>
            Mogen we jouw foto's publiceren op onze sociale media en het
            scorebord?
          </p>
          <p>Je kan deze terugvinden via de hashtag</p>
          <p>#whosnext</p>
        </div>
        <button
          className={`${styles.button} ${styles.prevButton}`}
          onClick={this.handlePrevClick}
        >
          terug
        </button>
        <button
          className={`${styles.button} ${styles.nextButton}`}
          onClick={this.handleNextClick}
        >
          {this.state.screen < 2 ? "volgende" : "start de game"}
        </button>
      </div>
    );
  }
}

export default TouchGDPR;
