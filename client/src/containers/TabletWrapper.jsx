import React from "react";
import { inject, PropTypes, observer } from "mobx-react";

import Carousel from "../components/Carousel";
import Called from "../components/Called";
import Screensaver from "../components/Screensaver";
import Onboarding from "../components/Onboarding";
import Game from "../components/Game";
import Socket from "../components/Socket";

const TabletWrapper = ({ store }) => {
  const { flowStatus } = store;

  console.log("ik ben op de tablet pagina");

  //   switch (flowStatus) {
  //     case "detectedFalse":
  //       return <Carousel />;
  //     case "startScreensaver":
  //       return <Screensaver />;
  //     case "onboardingStarted":
  //       return <Onboarding />;
  //     case "onboardingEnded":
  //       return <Socket />;
  //     case "startGame":
  //       return <Game />;
  //     case "calledUser":
  //       return <Called />;
  //     case "gameEnded":
  //       return <Onboarding />;
  //     case "Socket":
  //       return <Socket />;
  //     default:
  //       return <Carousel />;
  //   }
};

export default inject(`store`)(observer(TabletWrapper));
