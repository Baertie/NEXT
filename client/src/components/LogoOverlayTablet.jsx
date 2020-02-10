import React from "react";
import logoOverlayTablet from "../assets/img/logoOverlayTablet.png";
import basicStyles from "../styles/Touch.module.css";

const LogoOverlayTablet = () => {
  return <img src={logoOverlayTablet} className={basicStyles.overlay} />;
};

export default LogoOverlayTablet;
