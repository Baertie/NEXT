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
    default:
      return <Carousel />;
  }
};

export default inject(`store`)(observer(Wrapper));
