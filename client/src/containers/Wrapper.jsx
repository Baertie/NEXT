import React from "react";
import { inject, PropTypes, observer } from "mobx-react";

import Carousel from "../components/Carousel";
import Called from "../components/Called";
import Screensaver from "../components/Screensaver";
import Onboarding from "../components/Onboarding";
import Game from "../components/Game";
import Socket from "../components/Socket";
import SocketTest from "../components/SocketTest";

const Wrapper = ({ store }) => {
  const { flowStatus } = store;

  switch (flowStatus) {
    case "detectedFalse":
      return <Carousel />;
    case "startScreensaver":
      return <Screensaver />;
    case "onboardingStarted":
      return <Onboarding />;
    case "onboardingEnded":
      return <Socket />;
    case "startGame":
      return <Game />;
    case "calledUser":
      return <Called />;
    case "gameEnded":
      return <Onboarding />;
    case "SocketTest":
      return <SocketTest />;
    case "Socket":
      return <Socket />;
    // case "SocketTest":
    //   return <SocketTest />;
    default:
      return <Carousel />;
  }

  //   if (detected === false) {
  //     // Poster carousel + face detection
  //     return <Camera />;
  //   }

  //   if (detected === true) {
  //     // Onboarding (installation)
  //     return <Onboarding />;
  //   }
};

export default inject(`store`)(observer(Wrapper));
