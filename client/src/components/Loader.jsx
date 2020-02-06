import React from "react";

import styles from "../styles/Loader.module.css";

const Loader = () => {
  return (
    <>
      <div className={styles.red_background}></div>
      <div className={styles.logo_next_white}></div>
      <div className={styles.game_top_view}>
        <div className={styles.game_round}>
          <p className={styles.game_round_bot}>Game aan het laden...</p>
        </div>
      </div>
    </>
  );
};

export default Loader;
