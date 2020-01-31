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
    // const { endpoint } = this.state;
    //const socket = socketIOClient(":8080");

    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(stream => (this.ownVideoFeed.current.srcObject = stream))
      .catch(console.log("failed to get user media"));
  }

  componentWillUnmount() {
    // let stream = this.ownVideoFeed.current.srcObject;
    // let tracks = stream.getTracks();
    // tracks.forEach(function(track) {
    //   track.stop();
    // });
    // this.ownVideoFeed.current.srcObject = null;
  }

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
      </>
    );
  }
}

export default Socket;
