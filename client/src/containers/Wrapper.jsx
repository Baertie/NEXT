import React from "react";
import { inject, PropTypes, observer } from "mobx-react";

import Camera from "../components/Camera";
import Onboarding from "../components/Onboarding";

const Wrapper = ({ store }) => {
  const { detected } = store;
  console.log(`detected in dinges`, detected);

  if (detected === false) {
    return <Camera />;
  } else {
    return <Onboarding />;
  }
};

export default inject(`store`)(observer(Wrapper));
