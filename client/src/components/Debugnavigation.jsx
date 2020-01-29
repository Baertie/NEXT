import React from "react";
import { inject, PropTypes, observer } from "mobx-react";

const Debugnavigation = ({ store }) => {
  const handleResetClick = e => {
    console.log("reset");
    store.resetEverything();
  };

  const handleDetectedTrue = e => {
    console.log("onboarding");
    store.setDetected();
  };

  const handleGameStart = e => {
    console.log("start game");
    store.startGame();
  };
  return (
    <>
      <button onClick={handleResetClick}>Poster carousel</button>
      <button onClick={handleDetectedTrue}>Onboarding</button>
      <button onClick={handleGameStart}>Start Game</button>
    </>
  );
};

export default inject(`store`)(observer(Debugnavigation));
