import React, { Component } from "react";
import "./App.css";
import TabletWrapper from "./containers/TabletWrapper";
import { inject, observer } from "mobx-react";

import { withRouter, Switch, Route } from "react-router-dom";
import Carousel from "./components/Carousel";
import Called from "./components/Called";
import Socket from "./components/Socket";
import Screensaver from "./components/Screensaver";
import Onboarding from "./components/Onboarding";
import Postercarousel from "./components/Postercarousel";
import SocketJoin from "./components/SocketJoin";
import SocketTest from "./components/SocketTest";
import VideoTest from "./components/VideoTest";
import Game from "./components/Game";
import Scoreboard from "./components/Scoreboard";
import TeamBoard from "./components/TeamBoard";
import NameOverlay from "./components/NameOverlay";
import CallOnboarding from "./components/CallOnboarding";

import socketIOClient from "socket.io-client";

var socket;

class App extends Component {
  constructor() {
    super();
    this.state = {};

    // socket for deployment
    socket = socketIOClient("/");

    // socket for dev
    // socket = socketIOClient(":8080");
  }

  componentDidMount() {
    this.getQueryVariable("loc");
  }

  getQueryVariable(variable) {
    let query = this.props.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] === variable) {
        socket.emit("joinLocationRoom", pair[1]);
        this.props.store.setLocation(pair[1]);
      }
    }
    return false;
  }

  render() {
    return (
      <div className="App">
        <Switch>
          {/* screen */}
          <Route exact path="/" component={Carousel} />
          <Route path="/startConnecting" component={Socket} />
          <Route path="/called" component={Called} />
          <Route path="/screensaver" component={Screensaver} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/posterCarousel" component={Postercarousel} />
          <Route path="/game" component={Game} />
          <Route path="/joinGame" component={SocketJoin} />
          <Route path="/test" component={SocketTest} />
          <Route path="/scoreboard" component={Scoreboard} />
          <Route path="/teamboard" component={TeamBoard} />
          <Route path="/nameoverlay" component={NameOverlay} />
          <Route path="/callonboarding" component={CallOnboarding} />
          {/* tablet */}
          <Route path="/tablet" component={TabletWrapper}></Route>
        </Switch>
      </div>
    );
  }
}

export default inject("store")(observer(withRouter(App)));
export { socket };
