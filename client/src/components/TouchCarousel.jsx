import React from "react";
import styles from "../styles/TouchCarousel.module.css";
import TouchBackground from "../components/TouchBackground.jsx";

import nextLogoBigWhite from "../assets/img/logo/nextLogoBigWhite.png";
const TouchCarousel = () => {
  return (
    <div className={styles.container}>
      <TouchBackground />
      <img src={nextLogoBigWhite} alt="logo next" className={styles.logo}></img>
    </div>
  );
};

export default TouchCarousel;
