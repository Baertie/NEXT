import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";

import TouchCarousel from "../components/TouchCarousel";
import { socket } from "../App";
// import Called from "../components/Called";
// import Screensaver from "../components/Screensaver";
import TouchOnboarding from "../components/TouchOnboarding.jsx";
// import Game from "../components/Game";
// import Socket from "../components/Socket";

class TabletWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "onboarding"
    };
  }

  componentDidMount() {
    socket.on("onboarding", () => {
      this.setState({ currentPage: "onboarding" });
    });
  }

  render() {
    switch (this.state.currentPage) {
      case "onboarding":
        return <TouchOnboarding />;
      //   case "startScreensaver":
      //     return <Screensaver />;
      //   case "onboardingStarted":
      //     return <Onboarding />;
      //   case "onboardingEnded":
      //     return <Socket />;
      //   case "startGame":
      //     return <Game />;
      //   case "calledUser":
      //     return <Called />;
      //   case "gameEnded":
      //     return <Onboarding />;
      //   case "Socket":
      //     return <Socket />;
      default:
        return <TouchCarousel />;
    }
  }
}

export default inject(`store`)(observer(TabletWrapper));
