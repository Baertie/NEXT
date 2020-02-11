import React, { Component } from "react";
import styles from "../styles/TouchGDPR.module.css";
import { inject, observer } from "mobx-react";

import buttonStyles from "../styles/TouchOnboarding.module.css";
import basicStyles from "../styles/Touch.module.css";

import LogoOverlayTablet from "../components/LogoOverlayTablet";

class TouchGDPR extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmitPlayerdata = this.handleSubmitPlayerdata.bind(this);
  }

  handleSubmitPlayerdata() {
    // console.log(event.target.value);
    // this.setState({ value: event.target.value });
    // console.log(this.props.store);
    // console.log(props.store);
    // this.props.store.addPlayerScoreToDatabase();
    this.props.store.addPlayerScoreToDatabase();
  }
  render() {
    return (
      <div className={`${basicStyles.container} ${styles.container}`}>
        <LogoOverlayTablet />
        <div>
          <p className={styles.bodytext}>
            Mogen we jouw foto's publiceren op onze sociale media en het
            scorebord?
          </p>
          <p className={styles.subtext}>
            Je kan deze terugvinden via de hashtag
          </p>
          <p className={styles.hashtag}>#whosnext</p>
        </div>
        <div className={styles.buttonContainer}>
          <button
            className={`${buttonStyles.button} ${buttonStyles.prevButton} ${styles.fadedButton}`}
            onClick={this.handleReject}
          >
            nee
          </button>
          <button
            className={`${buttonStyles.button} ${buttonStyles.nextButton}`}
            onClick={this.handleSubmitPlayerdata}
          >
            Ja!
          </button>
        </div>
      </div>
    );
  }
}

export default inject(`store`)(observer(TouchGDPR));
