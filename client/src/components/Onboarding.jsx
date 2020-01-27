import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";

const Onboarding = ({ store }) => {
  const handleResetClick = e => {
    console.log("reset");
    store.resetEverything();
  };

  return (
    <>
      <p>Onboarding welkom</p>
      <button onClick={handleResetClick}>Reset</button>
    </>
  );
};

export default inject(`store`)(observer(Onboarding));
