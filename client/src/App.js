import React from "react";
import "./App.css";
import Wrapper from "./containers/Wrapper";
import TabletWrapper from "./containers/TabletWrapper";

import Debugnavigation from "./components/Debugnavigation";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact strict component={Wrapper}></Route>
        <Route path="/tablet" component={TabletWrapper}></Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
