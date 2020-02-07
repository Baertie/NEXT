import React from "react";
import "./App.css";
import Wrapper from "./containers/Wrapper";
import Debugnavigation from "./components/Debugnavigation";

import {
  // BrowserRouter as Router,
  withRouter,
  Switch,
  Route
} from "react-router-dom";
import Carousel from "./components/Carousel";
import Called from "./components/Called";
import Socket from "./components/Socket";
import Screensaver from "./components/Screensaver";
import Onboarding from "./components/Onboarding";
import Postercarousel from "./components/Postercarousel";
import Game from "./components/Game";
function App() {
  return (
    <div className="App">
      {/* <Debugnavigation />  */}
      {/* <Wrapper /> */}
      <Switch>
        <Route exact path="/" component={Carousel} />
        <Route path="/startConnecting" component={Socket} />
        <Route path="/called" component={Called} />
        <Route path="/screensaver" component={Screensaver} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/posterCarousel" component={Postercarousel} />
        <Route path="/game" component={Game} />
        {/*<Route path="/joinGame" component={ NEW COMPONENT } />
        <Route path="/gameInstructions" component={ NEW COMPONENT } />
        <Route path="/endGame" component={ NEW COMPONENT } />
        <Route path="/scorebord" component={ NEW COMPONENT } />*/}
      </Switch>
    </div>
  );
}

export default withRouter(App);
