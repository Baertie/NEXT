import React from "react";
import { inject, PropTypes, observer } from "mobx-react";

import Camera from "../components/Camera";
import Onboarding from "../components/Onboarding";
import Game from "../components/Game";

const Wrapper = ({ store }) => {
  const { flowStatus } = store;

  switch (flowStatus) {
    case "detectedFalse":
      return <Camera />;
    case "detectedTrue":
      return <Onboarding />;
    case "onboardingEnded":
      return <Game />;
    // case "gameEnded":
    //   return <Leaderboard />;
    default:
      return <Camera />;
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
