import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import { socket } from "../api/Api";

class Socket extends Component {
  constructor(props) {
    super(props);
    this.ownVideoFeed = React.createRef();

    this.state = {
      video: null,
      constraints: { audio: false, video: { width: 480, height: 720 } }
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.clientSocket = socketIOClient(":8080");

    console.log("clientsocket", this.clientSocket);
    this.clientSocket.on("connect", () => {
      // Gettin the users clientSocket id
      console.log("clientSocket id", this.clientSocket.id);
    });

    // All other users will get called by this
    this.clientSocket.emit("peerConnection", this.clientSocket.id);

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

  // If we want the player to press a buton to call others
  // callOtherPlayers = () => {
  //   this.clientSocket.emit("peerConnection", this.clientSocket.id);
  // };

  render() {
    return (
      <>
        <p>Socket test</p>
        <video
          style={{
            position: "absolute",
            top: "100px",
            left: "50px",
            height: "720",
            width: "480",
            objectFit: "cover"
          }}
          id="ownVideoFeed"
          ref={this.ownVideoFeed}
          width={480}
          height={720}
          autoPlay
          muted
        ></video>
        {/*
          If we want the player to press a buton to call others
          <button onClick={this.callOtherPlayers}>Call other users</button>
        */}
      </>
    );
  }
}

export default Socket;
