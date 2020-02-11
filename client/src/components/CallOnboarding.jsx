import React, { Component } from "react";
import FilterAffiche from "../assets/img/afficheFilter.png";
import Affiche from "../assets/img/afficheNoFilter.png";

import styles from "../styles/CallOnboarding.module.css";

class CallOnboarding extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.full_wrapper}>
        <div className={styles.component_wrapper}>
          <h1 className={styles.call_title}>
            Hoe speel je de{" "}
            <span className={styles.call_title_color}>next game</span>?
          </h1>
          <div className={styles.step}>
            <div className={styles.text_column}>
              <h2 className={styles.call_subtitle}>1. Affiche</h2>
              <p className={styles.call_text}>
                Je krijgt straks een{" "}
                <span className={styles.call_text_bold}>affiche</span> van next
                te zien.
              </p>
            </div>
            <img src={FilterAffiche} />
          </div>
          <div className={styles.step}>
            <div className={styles.text_column}>
              <h2 className={styles.call_subtitle}>2. Foto</h2>
              <p className={styles.call_text}>
                <span className={styles.call_text_bold}>Beeld</span> dit affiche
                zo goed mogelijk{" "}
                <span className={styles.call_text_bold}>uit.</span>
                Wanneer de{" "}
                <span className={styles.call_text_bold}>tijd op</span> is, wordt
                er een <span className={styles.call_text_bold}>foto</span>{" "}
                gemaakt.
              </p>
            </div>
            <div>
              <img src={FilterAffiche} />
              <img src={Affiche} />
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.text_column}>
              <h2 className={styles.call_subtitle}>3. Punten</h2>
              <p className={styles.call_text}>
                Hoe <span className={styles.call_text_bold}>beter</span> je de
                affiche{" "}
                <span className={styles.call_text_bold}>uitbeeldt,</span>
                Hoe <span className={styles.call_text_bold}>
                  meer punten
                </span>{" "}
                je verdient.
              </p>
            </div>
            <div>
              <img src={FilterAffiche} />
              <img src={Affiche} />
              <p>+75</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default CallOnboarding;
