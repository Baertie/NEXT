import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import TouchCarousel from "../components/TouchCarousel";
import { socket } from "../App";

import TouchOnboarding from "../components/TouchOnboarding.jsx";
import TouchConnecting from "../components/TouchConnecting.jsx";
import TouchCalled from "../components/TouchCalled.jsx";
import TouchNameInput from "../components/TouchNameInput.jsx";
import TouchGameTimer from "../components/TouchGameTimer.jsx";
import TouchRegioInput from "../components/TouchRegioInput.jsx";
import TouchGDPR from "../components/TouchGDPR.jsx";
import TouchLeaderboard from "../components/TouchLeaderboard.jsx";

class TabletWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "leaderboard"
    };
  }

  componentDidMount() {
    socket.on("onboarding", () => {
      this.setState({ currentPage: "onboarding" });
    });

    socket.on("connecting", () => {
      this.setState({ currentPage: "connecting" });
    });

    socket.on("called", () => {
      this.setState({ currentPage: "called" });
    });

    socket.on("nameinput", () => {
      this.setState({ currentPage: "nameinput" });
    });

    socket.on("game", () => {
      this.setState({ currentPage: "game" });
    });

    socket.on("regioinput", () => {
      this.setState({ currentPage: "regioinput" });
    });

    socket.on("gdpr", () => {
      this.setState({ currentPage: "gdpr" });
    });

    socket.on("leaderboard", () => {
      this.setState({ currentPage: "leaderboard" });
    });
  }

  render() {
    switch (this.state.currentPage) {
      case "onboarding":
        return <TouchOnboarding />;
      case "connecting":
        return <TouchConnecting />;
      case "called":
        return <TouchCalled />;
      case "nameinput":
        return <TouchNameInput />;
      case "game":
        return <TouchGameTimer />;
      case "regioinput":
        return <TouchRegioInput />;
      case "gdpr":
        return <TouchGDPR />;
      case "leaderboard":
        return <TouchLeaderboard />;
      default:
        return <TouchCarousel />;
    }
  }
}

export default inject(`store`)(observer(TabletWrapper));
