import React, { Component } from "react";
// import { inject, PropTypes, observer } from "mobx-react";
import socketIOClient from "socket.io-client";

import { join, signaling, send } from "./SocketVideo";
import NeatRTC from "neat-rtc";

import styles from "../styles/Called.module.css";

class Called extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTimer: null
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
      ]
    };
    this.rtc = new NeatRTC(config, sendSignalingMessage);
    // Socket.IO join messages from server
    join(message => {
      const { clientCount } = message;
      if (clientCount < 2) {
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
    // Not needed
  };
  mediaStreamRemoved = () => {
    // Not needed
  };
  mediaStreamRemoteRemoved = () => {
    // Not needed
  };
  datachannelOpen = channel => {
    // Not needed
  };
  datachannelMessage = (channel, message) => {
    // Not needed
  };
  datachannelError = channel => {
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

  startCamera = () => {
    // This sends your video
    // start this when other player joins
    this.rtc.media("start");
  };

  componentDidMount() {
    // connect to socket
    this.clientSocket = socketIOClient(":8080");
    this.clientSocket.on("searchTimer", time => {
      this.setState({
        searchTimer: time
      });
      if (this.state.searchTimer === 0) {
        // Player didn't join, so back to carousel
        this.props.history.push("/");
      }
    });
  }

  joinGame = () => {
    console.log("called.jsx ik wil meedoen");
    this.props.history.push("/joinGame");
  };

  render() {
    // return (
    //   <>
    //     <p style={{ fontStyle: "italic", fontSize: 15 }}>CALLED PAGE</p>
    //     <button onClick={() => this.props.store.startSocket()}>socket</button>
    //     <button onClick={this.answerCall}>Accept call</button>
    //     <p style={{ fontSize: 25 }}>Timer: {this.state.searchTimer}</p>

    //     <video id="localVideo" muted width="300" height="200"></video>
    //     <video id="remoteVideo" muted width="300" height="200"></video>
    //   </>
    // );
    return (
      <>
        <button
          style={{
            position: "absolute",
            left: 100,
            top: 100,
            zIndex: 100,
            fontSize: 25
          }}
          onClick={this.joinGame}
        >
          Start game bro
        </button>
        <div className={styles.red_background}></div>
        <div className={styles.logo_next_white}></div>
        <div className={styles.search_timer}>
          <div className={styles.search_timer_text}>
            {this.state.searchTimer}
          </div>
          {/* <svg className={styles.timer_svg}>
            <circle
              className={styles.timer_circle}
              r="40"
              cx="50"
              cy="50"
            ></circle>
          </svg> */}
          <div className={styles.timer_wrapper}>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
          </div>
        </div>
        <div className={styles.front_content}>
          <div className={styles.white_content_background_small}>
            <h1 className={styles.title_top}>
              je wordt uitgedaagd <br /> voor de{" "}
              <span className={styles.red_color}>next game</span>
            </h1>
          </div>
          <div className={styles.white_content_background_big}>
            <h1 className={styles.title_bot}>
              wat is de
              <span className={styles.red_color}> next game</span>?
            </h1>
            <ul>
              <li className={styles.game_info}>
                <div className={styles.game_info_left}>
                  <h2 className={styles.game_subtitle}>1. verbind</h2>
                  <p className={styles.game_info_text}>
                    Accepteer de uitnodiging.{" "}
                    <span className={styles.game_bold}>Verbind</span> met
                    spelers uit{" "}
                    <span className={styles.game_bold}>
                      Kortrijk, Lille, Tournai en Valenciennes.
                    </span>
                  </p>
                </div>
                <div className={styles.game_info_1}></div>
              </li>
              <li className={styles.game_info}>
                <div className={styles.game_info_left}>
                  <h2 className={styles.game_subtitle}>2. poseer</h2>
                  <p className={styles.game_info_text}>
                    Beeld zo goed mogelijk <br /> de
                    <span className={styles.game_bold}>affiches</span> van NEXT
                    uit.
                  </p>
                </div>
                <div className={styles.game_info_2}></div>
              </li>
              <li className={styles.game_info}>
                <div className={styles.game_info_left}>
                  <h2 className={styles.game_subtitle}>3.win</h2>
                  <p className={styles.game_info_text}>
                    Hoe beter je de <br /> affiches uitbeeldt, <br /> hoe meer{" "}
                    <span className={styles.game_bold}>punten</span> je <br />{" "}
                    verdient voor jouw{" "}
                    <span className={styles.game_bold}>regio</span>.
                  </p>
                </div>
                <div className={styles.game_info_3}>
                  <h3 className={styles.game_win_location}>Kortrijk</h3>
                  <div className={styles.score_added}>+75</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

// export default inject(`store`)(observer(Called));
export default Called;
