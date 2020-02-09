import React from "react";
import styles from "../styles/TouchLeaderboard.module.css";

import basicStyles from "../styles/Touch.module.css";

import LogoOverlayTablet from "../components/LogoOverlayTablet";

const TouchLeaderboard = () => {
  return (
    <div className={`${basicStyles.container} ${styles.container}`}>
      <LogoOverlayTablet />
      <div>
        <p className={styles.bodytext}>Proficiat!</p>
        <p className={styles.bodytext}>Je hebt het eerste level uitgespeeld.</p>
      </div>

      <div>
        <p className={styles.smalltext}>Next nodigt jou uit voor</p>
        <p className={styles.bigtext}>'The next level'</p>
      </div>
      <p className={styles.smalltext}>
        meer info op nextfestival.eu/thenextlevel
      </p>
    </div>
  );
};

export default TouchLeaderboard;
