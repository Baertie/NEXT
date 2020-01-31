import React, { Component } from "react";
import socketIOClient from "socket.io-client";

var socket;
class Api extends Component {
  constructor(props) {
    super(props);
    this.state = { response: 0, endpoint: ":8080" };
  }

  socket = socketIOClient(this.state.endpoint);

  render() {
    return <></>;
  }
}

export default Api;
export { socket };
