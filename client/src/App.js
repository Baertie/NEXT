import React, { Component } from "react";
import "./App.css";
// import Wrapper from "./containers/Wrapper";
import TabletWrapper from "./containers/TabletWrapper";
import { inject, observer } from "mobx-react";

// import Debugnavigation from "./components/Debugnavigation";
// import { Route, Switch, withRouter, Redirect } from "react-router-dom";

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
// import SocketJoin from "./components/SocketJoin";
// import SocketTest from "./components/SocketTest";
import Game from "./components/Game";
import socketIOClient from "socket.io-client";

var socket;

class App extends Component {
  constructor() {
    super();
    this.state = {};

    socket = socketIOClient(":8080");
  }

  componentDidMount() {
    console.log("testbaas", this.props.location);
    this.getQueryVariable("loc");
  }

  getQueryVariable(variable) {
    let query = this.props.location.search.substring(1);
    console.log(query); //"app=article&act=news_content&aid=160990"
    let vars = query.split("&");
    console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
      if (pair[0] === variable) {
        //this.props.store.setLocation(pair[1]);
        console.log(pair[1]);
        // return pair[1];
        socket.emit("joinLocationRoom", pair[1]);
      }
    }
    return false;
  }

  render() {
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
          <Route path="/joinGame" component={SocketJoin} />
          {/*<Route path="/gameInstructions" component={ NEW COMPONENT } />
        <Route path="/endGame" component={ NEW COMPONENT } />
        <Route path="/scorebord" component={ NEW COMPONENT } />*/}
          <Route path="/tablet" component={TabletWrapper}></Route>
        </Switch>
      </div>
    );
  }
}

export default inject("store")(observer(withRouter(App)));
export { socket };
