import React, { Component } from "react";
import styles from "../styles/TouchCarousel.module.css";

import nextLogoBigWhite from "../assets/img/logo/nextLogoBigWhite.png";
const TouchCarousel = () => {
  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <img src={nextLogoBigWhite} alt="logo next" className={styles.logo}></img>
    </div>
  );
};

export default TouchCarousel;
