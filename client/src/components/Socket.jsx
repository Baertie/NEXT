import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import { socket } from "../api/Api";

class Socket extends Component {
  constructor(props) {
    super(props);
    this.ownVideoFeed = React.createRef();

    this.state = {
      video: null,
      constraints: { audio: false, video: { width: 480, height: 720 } },
      callMessage: ""
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.clientSocket = socketIOClient(":8080");
    this.clientSocket.on("connect", () => {
      // Gettin the users clientSocket id
      console.log("clientSocket id", this.clientSocket.id);
    });

    // When another user is calling you
    this.clientSocket.on("newPeerConnection", () => {
      this.setState({
        callMessage: "Ring ring"
      });
      // ADD
      // Go to 'being called' screen
    });

    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(stream => (this.ownVideoFeed.current.srcObject = stream))
      .catch(console.log("failed to get user media"));
  }

  componentWillUnmount() {
    let stream = this.ownVideoFeed.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.ownVideoFeed.current.srcObject = null;
  }

  callOtherPlayers = () => {
    this.clientSocket.emit("peerConnection", this.clientSocket.id);
    this.setState({ callMessage: "" });
    // ADD
    // Go to timer and connection screen
  };

  render() {
    return (
      <>
        <p>Socket test</p>
        <video
          id="ownVideoFeed"
          ref={this.ownVideoFeed}
          width={200}
          height={200}
          autoPlay
          muted
        ></video>
        <button onClick={this.callOtherPlayers}>Call other users</button>
        <p>{this.state.callMessage}</p>
      </>
    );
  }
}

export default Socket;
