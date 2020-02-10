import React, { Component } from "react";
import { join, signaling, send } from "./SocketVideo";
import NeatRTC from "neat-rtc";

import "../styles/SocketTest.module.css";

class SocketTest extends Component {
  constructor(props) {
    super(props);
    this.ownVideoFeed = React.createRef();
    this.state = {
      video: null,
      constraints: { audio: false, video: { width: 480, height: 720 } },
      searchTimer: 45
    };
    // Setup NeatRTC
    const {
      connected,
      mediaStreamConnected,
      mediaStreamRemoved,
      datachannelOpen,
      datachannelMessage,
      datachannelError,
      datachannelClose,
      sendSignalingMessage,
      mediaStreamRemoteRemoved
    } = this;
    const config = {
      devMode: true,
      videoIdLocal: "localVideo",
      videoIdRemote: "remoteVideo",
      connected: connected,
      mediaStreamConnected: mediaStreamConnected,
      mediaStreamRemoved: mediaStreamRemoved,
      mediaStreamRemoteRemoved: mediaStreamRemoteRemoved,
      datachannels: [
        {
          name: "text",
          callbacks: {
            open: datachannelOpen,
            message: datachannelMessage,
            error: datachannelError,
            close: datachannelClose
          }
        }
      ],
      iceServers: [
        {
          url: "stun:stun.l.google.com:19302"
        }
      ],
      optional: [
        {
          DtlsSrtpKeyAgreement: true
        },
        {
          RtpDataChannels: true
        }
      ]
    };
    this.rtc = new NeatRTC(config, sendSignalingMessage);
    // Socket.IO join messages from server
    join(message => {
      const { clientCount } = message;
      if (clientCount === 2) {
        this.rtc.connect();
      }
    });
    // Socket.IO signaling messages from server
    signaling(message => {
      this.rtc.handleSignaling(message);
    });
  }
  connected = () => {
    // Not needed
  };
  mediaStreamConnected = () => {
    console.log("mediastreamconnected");
    // Not needed
  };
  mediaStreamRemoved = () => {
    // Not needed
  };
  mediaStreamRemoteRemoved = () => {
    // Not needed
  };
  datachannelOpen = channel => {
    console.log("open", channel);
    // Not needed
  };
  datachannelMessage = (channel, message) => {
    console.log("channelmessage", channel);

    console.log("channelmessage", message);
    // Not needed
  };
  datachannelError = channel => {
    console.log("channelerror", channel);
    // Not needed
  };
  datachannelClose = channel => {
    // Not needed
  };
  stopCamera = () => {
    // this.rtc.media("stop");
    // Not needed to stop webcam
  };
  stopRemoteCamera = () => {
    // this.rtc.media("stopRemote");
    // console.log("1");
    // Not needed to stop other webcam
  };
  sendText = () => {
    // No messages needed with webrtc
  };

  sendSignalingMessage = message => {
    send("signaling", message);
  };

  componentDidMount() {
    // start showing own video on screen
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(stream => (this.ownVideoFeed.current.srcObject = stream))
      .catch(console.log("failed to get user media"));
  }

  startCamera = () => {
    // This sends your video
    // start this when other player joins
    this.rtc.media("start");
  };
  render() {
    return (
      <div className="App">
        {/* <header className="App-header"></header> */}
        <div className="local-container">
          <h2>Local</h2>
          <video
            id="ownVideoFeed"
            ref={this.ownVideoFeed}
            height={200}
            width={160}
            autoPlay
            muted
          />
          <video id="localVideo" muted style={{ display: "none" }}></video>
          <button onClick={this.startCamera}>Start camera</button>
          <button onClick={this.stopCamera}>Stop camera</button>
        </div>
        <div className="remote-container">
          <h2>Remote</h2>
          <video id="remoteVideo" muted width="300" height="200"></video>
          <button onClick={this.stopRemoteCamera}>Stop remote stream</button>
        </div>
      </div>
    );
  }
}

export default SocketTest;
