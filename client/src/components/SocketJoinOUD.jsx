import React, { Component } from "react";
// import { inject, observer } from "mobx-react";
// import socketIOClient from "socket.io-client";
import { socket } from "../App.js";
import { join, signaling, send } from "./SocketVideo";
import NeatRTC from "neat-rtc";

import styles from "../styles/Socket.module.css";

// import { socket } from "../api/Api";
class SocketJoin extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.ownVideoFeed = React.createRef();
    this.state = {
      video: null,
      constraints: {
        audio: false,
        video: { width: 480, height: 720 }
      },
      searchTimer: null,
      callerAnswered: false,
      videoSharing: false
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
      if (clientCount === 2) {
        // console.log("rtc connect JOIN.JSX");
        this.rtc.connect();
      }
    });
    // Socket.IO signaling messages from server
    signaling(message => {
      // Ontvangt messages
      this.rtc.handleSignaling(message);
    });
  }

  connected = () => {
    // Not needed
    console.log("JOIN connected");
  };
  mediaStreamConnected = () => {
    // Not needed
    console.log("JOIN mediaStreamConnected");
    // HIER DOEN
    // this.rtc.media("start");
  };
  mediaStreamRemoved = () => {
    // Not needed
    console.log("JOIN mediaStreamRemoved");
  };
  mediaStreamRemoteRemoved = () => {
    // Not needed
    console.log("JOIN mediaStreamRemoteRemoved");
  };
  datachannelOpen = channel => {
    // Not needed
    console.log("JOIN datachannelOpen");
  };
  datachannelMessage = (channel, message) => {
    // Not needed
    console.log("JOIN datachannelMessage");
  };
  datachannelError = channel => {
    // Not needed
    console.log("JOIN datachannelError");
  };
  datachannelClose = channel => {
    // Not needed
    console.log("JOIN datachannelClose");
  };
  stopCamera = () => {
    // this.rtc.media("stop");
    // Not needed to stop webcam
  };
  stopRemoteCamera = () => {
    this.rtc.media("stopRemote");
    // console.log("1");
    // Not needed to stop other webcam
  };
  sendText = () => {
    // No messages needed with webrtc
  };

  sendSignalingMessage = message => {
    console.log("send signal socket join");
    send("signaling", message);
  };

  startCamera = () => {
    // This sends your video
    // start this when other player joins
    console.log("start camera socketjoin.jsx");
    this.rtc.media("start");
  };

  componentDidMount() {
    this._isMounted = true;
    // console.log("Binnen 1s socket newPeerJoined + start camera");
    setTimeout(() => {
      socket.emit("newPeerJoined");
      this.startCamera();
    }, 1000);
    socket.on("peerAnswered", () => {
      console.log("Ontvang peerAnswered");
      // setTimeout(() => {
      // this.startCamera();
      // }, 1000);
    });
    socket.on("searchTimer", time => {
      if (this._isMounted) {
        this.setState({
          searchTimer: time
        });
      }
      if (this.state.searchTimer === 0) {
        // GO TO GAME
        this.props.history.push("/game");
      }
    });

    // navigator.mediaDevices
    //   .getUserMedia(this.state.constraints)
    //   .then(stream => (this.ownVideoFeed.current.srcObject = stream))
    //   .catch(console.log("failed to get user media"));
    this.getCamera();
  }

  getCamera = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        this.state.constraints
      );
      this.ownVideoFeed.current.srcObject = stream;
    } catch (err) {
      console.log("kapoet");
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    let stream = this.ownVideoFeed.current.srcObject;
    let tracks = stream.getTracks();
    tracks.forEach(function(track) {
      track.stop();
    });
    this.ownVideoFeed.current.srcObject = null;
  }
  connectNU = () => {
    console.log("connect nu button pressed");
    this.rtc.media("start");
  };
  render() {
    return (
      <>
        {/* <button
          style={{
            position: "absolute",
            fontSize: 50,
            top: 100,
            left: 100,
            zIndex: 50
          }}
          onClick={this.connectNU}
        >
          Connect nu
        </button>
        <button
          style={{
            position: "absolute",
            fontSize: 50,
            top: 200,
            left: 100,
            zIndex: 50
          }}
          onClick={this.stopRemoteCamera}
        >
          stop remote
        </button> */}
        <div className={styles.red_background}></div>
        <div className={styles.logo_next_white}></div>
        <div className={styles.search_timer}>
          <div className={styles.search_timer_text}>
            {this.state.searchTimer}
          </div>
          {/* <div className={styles.timer_wrapper}>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
            <div className={styles.timer_dot}></div>
          </div> */}
        </div>
        <div className={styles.front_content}>
          <div className={styles.white_content_background}>
            <h1 className={styles.title}>
              Tegenstanders <br /> aan het zoeken...
            </h1>
            <div className={styles.map_img}></div>
            <div className={styles.map_wrapper}>
              <svg
                className={styles.map_right}
                width="21"
                height="335"
                viewBox="0 0 21 335"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0.373878L0 335H21L21 0L0 0.373878Z" fill="black" />
              </svg>
              <svg
                className={styles.map_left}
                width="21"
                height="335"
                viewBox="0 0 21 335"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0.373878L0 335H21L21 0L0 0.373878Z" fill="black" />
              </svg>
              <svg
                className={styles.map_top}
                width="361"
                height="249"
                viewBox="0 0 361 249"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M314.915 0L291.459 53.8265L258.01 130.733C242.979 167.965 229.6 193.152 217.046 207.556C202.758 223.898 189.957 226.004 180.459 226.004C170.961 226.004 158.242 223.898 143.954 207.556C131.4 193.152 117.938 167.965 102.907 130.565L46.1677 0L0 0L0 22.912L31.5493 22.912L82.2594 139.662C98.447 179.927 112.735 206.377 127.188 222.887C135.86 232.827 145.358 239.987 155.517 244.199C165.84 248.495 174.677 249 180.459 249C186.24 249 195.077 248.495 205.401 244.199C215.477 239.987 225.057 232.827 233.729 222.887C248.182 206.377 262.388 180.011 278.575 139.831L311.942 63.1766L329.451 22.912L361 22.912V0L314.915 0Z"
                  fill="black"
                />
              </svg>
              <svg
                className={styles.map_bottom}
                width="361"
                height="249"
                viewBox="0 0 361 249"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M314.915 0L291.459 53.8265L258.01 130.733C242.979 167.965 229.6 193.152 217.046 207.556C202.758 223.898 189.957 226.004 180.459 226.004C170.961 226.004 158.242 223.898 143.954 207.556C131.4 193.152 117.938 167.965 102.907 130.565L46.1677 0L0 0L0 22.912L31.5493 22.912L82.2594 139.662C98.447 179.927 112.735 206.377 127.188 222.887C135.86 232.827 145.358 239.987 155.517 244.199C165.84 248.495 174.677 249 180.459 249C186.24 249 195.077 248.495 205.401 244.199C215.477 239.987 225.057 232.827 233.729 222.887C248.182 206.377 262.388 180.011 278.575 139.831L311.942 63.1766L329.451 22.912L361 22.912V0L314.915 0Z"
                  fill="black"
                />
              </svg>
              <svg
                className={styles.kortrijk}
                width="70"
                height="69"
                viewBox="0 0 70 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="35"
                  cy="34.36"
                  rx="32"
                  ry="31.36"
                  fill="white"
                  stroke="#E20613"
                  strokeWidth="5"
                />
                <path
                  d="M25.492 22.332H28.264C28.72 22.332 29.104 22.356 29.416 22.404C29.728 22.428 29.944 22.632 30.064 23.016C30.088 23.136 30.1 23.268 30.1 23.412C30.1 23.532 30.1 23.664 30.1 23.808V25.248L30.1 29.928V30.72C30.1 30.936 30.1 31.152 30.1 31.368C30.1 31.584 30.136 31.776 30.208 31.944C30.232 31.992 30.268 32.04 30.316 32.088C30.388 32.136 30.448 32.16 30.496 32.16C30.664 32.208 30.82 32.16 30.964 32.016C31.132 31.872 31.252 31.764 31.324 31.692C31.516 31.5 31.708 31.308 31.9 31.116C32.092 30.924 32.272 30.72 32.44 30.504C32.512 30.456 32.608 30.372 32.728 30.252C32.824 30.156 32.92 30.06 33.016 29.964C33.112 29.844 33.196 29.724 33.268 29.604C33.316 29.556 33.364 29.52 33.412 29.496C33.46 29.472 33.508 29.436 33.556 29.388C33.676 29.196 33.82 29.04 33.988 28.92C34.156 28.776 34.3 28.62 34.42 28.452C34.564 28.26 34.696 28.104 34.816 27.984C34.864 27.96 34.924 27.912 34.996 27.84C35.284 27.456 35.608 27.108 35.968 26.796C36.328 26.484 36.652 26.136 36.94 25.752L37.12 25.572C37.192 25.5 37.264 25.428 37.336 25.356C37.408 25.284 37.48 25.2 37.552 25.104C37.576 25.056 37.6 25.032 37.624 25.032C37.648 25.008 37.684 24.972 37.732 24.924C37.876 24.828 37.984 24.696 38.056 24.528C38.104 24.48 38.164 24.432 38.236 24.384C38.308 24.336 38.368 24.288 38.416 24.24C38.488 24.12 38.572 24.012 38.668 23.916C38.764 23.82 38.86 23.712 38.956 23.592C39.004 23.544 39.04 23.508 39.064 23.484C39.112 23.46 39.16 23.424 39.208 23.376C39.376 23.136 39.568 22.932 39.784 22.764C40 22.572 40.276 22.44 40.612 22.368C40.804 22.32 41.02 22.308 41.26 22.332C41.524 22.332 41.764 22.332 41.98 22.332H44.752C45.016 22.332 45.292 22.332 45.58 22.332C45.892 22.308 46.132 22.356 46.3 22.476C46.444 22.596 46.48 22.74 46.408 22.908C46.336 23.052 46.276 23.172 46.228 23.268C46.108 23.388 45.988 23.508 45.868 23.628C45.748 23.724 45.628 23.832 45.508 23.952C45.34 24.144 45.172 24.324 45.004 24.492C44.86 24.66 44.692 24.828 44.5 24.996C43.66 25.836 42.82 26.688 41.98 27.552C41.14 28.416 40.3 29.268 39.46 30.108C39.076 30.54 38.668 30.948 38.236 31.332C38.068 31.5 37.912 31.668 37.768 31.836C37.624 31.98 37.528 32.184 37.48 32.448C37.432 32.64 37.468 32.832 37.588 33.024C37.708 33.192 37.804 33.336 37.876 33.456C38.116 33.816 38.356 34.176 38.596 34.536C38.86 34.872 39.112 35.22 39.352 35.58C40.36 37.02 41.368 38.448 42.376 39.864C43.384 41.256 44.392 42.672 45.4 44.112L46.696 45.948C46.792 46.092 46.888 46.236 46.984 46.38C47.104 46.5 47.212 46.632 47.308 46.776C47.38 46.896 47.464 47.064 47.56 47.28C47.656 47.496 47.62 47.664 47.452 47.784C47.284 47.904 47.044 47.964 46.732 47.964C46.42 47.964 46.132 47.964 45.868 47.964L43.024 47.964C42.76 47.964 42.496 47.976 42.232 48C41.968 48 41.728 47.976 41.512 47.928C41.248 47.832 41.032 47.7 40.864 47.532C40.72 47.34 40.576 47.136 40.432 46.92C40.288 46.728 40.144 46.536 40 46.344C39.88 46.128 39.748 45.912 39.604 45.696C38.956 44.688 38.296 43.704 37.624 42.744C36.952 41.784 36.28 40.8 35.608 39.792C35.344 39.384 35.08 38.988 34.816 38.604C34.576 38.22 34.324 37.836 34.06 37.452C33.964 37.332 33.844 37.2 33.7 37.056C33.556 36.888 33.364 36.828 33.124 36.876C32.884 36.948 32.644 37.116 32.404 37.38C32.164 37.62 31.96 37.824 31.792 37.992C31.672 38.112 31.552 38.244 31.432 38.388C31.312 38.508 31.192 38.628 31.072 38.748C30.904 38.916 30.748 39.084 30.604 39.252C30.46 39.396 30.34 39.576 30.244 39.792C30.172 39.936 30.124 40.092 30.1 40.26C30.1 40.428 30.1 40.608 30.1 40.8V41.268C30.076 41.388 30.064 41.532 30.064 41.7C30.088 41.844 30.1 41.976 30.1 42.096V43.788V46.344C30.1 46.608 30.088 46.86 30.064 47.1C30.064 47.34 30.004 47.532 29.884 47.676C29.764 47.82 29.584 47.904 29.344 47.928C29.104 47.952 28.852 47.964 28.588 47.964H26.14C25.876 47.964 25.624 47.964 25.384 47.964C25.144 47.94 24.94 47.868 24.772 47.748C24.604 47.628 24.52 47.412 24.52 47.1C24.52 46.764 24.52 46.44 24.52 46.128L24.52 41.952V27.588L24.52 24.24C24.52 23.976 24.508 23.7 24.484 23.412C24.484 23.124 24.532 22.896 24.628 22.728C24.772 22.56 24.964 22.44 25.204 22.368C25.252 22.344 25.3 22.344 25.348 22.368C25.396 22.368 25.444 22.356 25.492 22.332Z"
                  fill="#E20613"
                />
              </svg>
              <svg
                className={styles.valenciennes}
                width="70"
                height="70"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="35"
                  cy="35"
                  r="32"
                  fill="white"
                  stroke="#E20613"
                  strokeWidth="5"
                />
                <path
                  d="M23.936 23.332H26.852C27.116 23.332 27.38 23.332 27.644 23.332C27.932 23.332 28.16 23.392 28.328 23.512C28.544 23.632 28.688 23.824 28.76 24.088C28.832 24.352 28.916 24.616 29.012 24.88C29.18 25.336 29.324 25.792 29.444 26.248C29.588 26.704 29.744 27.172 29.912 27.652C30.392 29.14 30.86 30.628 31.316 32.116C31.796 33.604 32.276 35.092 32.756 36.58C32.876 36.988 32.996 37.396 33.116 37.804C33.26 38.212 33.392 38.62 33.512 39.028C33.584 39.244 33.656 39.46 33.728 39.676C33.8 39.892 33.896 40.084 34.016 40.252C34.04 40.3 34.064 40.336 34.088 40.36C34.136 40.36 34.184 40.384 34.232 40.432C34.496 40.432 34.664 40.324 34.736 40.108C34.832 39.868 34.916 39.652 34.988 39.46C35.18 38.956 35.348 38.44 35.492 37.912C35.636 37.384 35.804 36.844 35.996 36.292C36.524 34.708 37.028 33.136 37.508 31.576C38.012 29.992 38.528 28.408 39.056 26.824C39.176 26.44 39.296 26.068 39.416 25.708C39.536 25.324 39.656 24.94 39.776 24.556C39.872 24.364 39.944 24.172 39.992 23.98C40.064 23.788 40.196 23.632 40.388 23.512C40.556 23.392 40.748 23.332 40.964 23.332C41.204 23.332 41.444 23.332 41.684 23.332H44.096C44.336 23.332 44.576 23.332 44.816 23.332C45.056 23.332 45.248 23.38 45.392 23.476C45.632 23.596 45.716 23.824 45.644 24.16C45.572 24.472 45.5 24.736 45.428 24.952C45.212 25.504 45.008 26.08 44.816 26.68C44.648 27.256 44.468 27.832 44.276 28.408C44.204 28.552 44.144 28.696 44.096 28.84C44.072 28.984 44.036 29.128 43.988 29.272C43.796 29.776 43.616 30.292 43.448 30.82C43.304 31.348 43.136 31.876 42.944 32.404C42.296 34.348 41.648 36.304 41 38.272C40.352 40.216 39.704 42.16 39.056 44.104C38.84 44.656 38.648 45.22 38.48 45.796C38.312 46.348 38.132 46.9 37.94 47.452C37.82 47.788 37.7 48.1 37.58 48.388C37.46 48.652 37.22 48.832 36.86 48.928C36.668 48.976 36.452 49 36.212 49C35.972 48.976 35.744 48.964 35.528 48.964H32.936C32.672 48.964 32.384 48.976 32.072 49C31.784 49 31.544 48.94 31.352 48.82C31.088 48.676 30.908 48.46 30.812 48.172C30.74 47.86 30.656 47.56 30.56 47.272C30.392 46.768 30.224 46.264 30.056 45.76C29.912 45.232 29.756 44.716 29.588 44.212C29.06 42.7 28.556 41.176 28.076 39.64C27.596 38.104 27.092 36.568 26.564 35.032C26.348 34.336 26.132 33.652 25.916 32.98C25.724 32.284 25.508 31.6 25.268 30.928C25.172 30.712 25.1 30.496 25.052 30.28C25.004 30.064 24.932 29.848 24.836 29.632C24.62 28.96 24.404 28.3 24.188 27.652C23.996 26.98 23.78 26.308 23.54 25.636C23.492 25.42 23.432 25.216 23.36 25.024C23.288 24.808 23.216 24.592 23.144 24.376C23.12 24.256 23.096 24.136 23.072 24.016C23.072 23.896 23.096 23.788 23.144 23.692C23.216 23.524 23.372 23.416 23.612 23.368C23.66 23.344 23.708 23.344 23.756 23.368C23.828 23.368 23.888 23.356 23.936 23.332Z"
                  fill="#E20613"
                />
              </svg>
              <svg
                className={styles.lille}
                width="70"
                height="70"
                viewBox="0 0 70 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="35"
                  cy="35"
                  r="32"
                  fill="white"
                  stroke="#E20613"
                  strokeWidth="5"
                />
                <path
                  d="M27.8221 22.332H30.8821C31.1461 22.332 31.3981 22.344 31.6381 22.368C31.9021 22.368 32.0941 22.452 32.2141 22.62C32.3341 22.788 32.3941 23.016 32.3941 23.304C32.3941 23.568 32.3941 23.856 32.3941 24.168V27.444V38.352L32.3941 40.476C32.3941 40.668 32.3821 40.86 32.3581 41.052C32.3581 41.22 32.3821 41.388 32.4301 41.556V41.916C32.4301 42.084 32.4301 42.252 32.4301 42.42C32.4541 42.564 32.4901 42.696 32.5381 42.816C32.7061 43.128 33.0421 43.284 33.5461 43.284C34.0501 43.284 34.5421 43.284 35.0221 43.284H42.0061C42.1981 43.284 42.4381 43.284 42.7261 43.284C43.0141 43.26 43.2901 43.26 43.5541 43.284C43.8181 43.284 44.0581 43.308 44.2741 43.356C44.5141 43.404 44.6701 43.476 44.7421 43.572C44.8621 43.716 44.9221 43.896 44.9221 44.112C44.9221 44.328 44.9221 44.556 44.9221 44.796L44.9221 46.452C44.9221 46.644 44.9221 46.824 44.9221 46.992C44.9461 47.16 44.9341 47.304 44.8861 47.424C44.7901 47.616 44.6701 47.748 44.5261 47.82C44.4061 47.916 44.2261 47.964 43.9861 47.964C43.7461 47.964 43.5181 47.964 43.3021 47.964H40.7461H30.9901H28.3981C28.0621 47.964 27.7621 47.952 27.4981 47.928C27.2581 47.88 27.0781 47.76 26.9581 47.568C26.8621 47.424 26.8141 47.244 26.8141 47.028C26.8141 46.788 26.8141 46.56 26.8141 46.344V43.824L26.8141 34.284V26.148L26.8141 23.88C26.8141 23.664 26.8141 23.448 26.8141 23.232C26.8381 23.016 26.8861 22.848 26.9581 22.728C27.0541 22.56 27.2461 22.44 27.5341 22.368C27.5821 22.344 27.6301 22.344 27.6781 22.368C27.7261 22.368 27.7741 22.356 27.8221 22.332Z"
                  fill="#E20613"
                />
              </svg>
              <svg
                className={styles.tournai}
                width="70"
                height="69"
                viewBox="0 0 70 69"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="35"
                  cy="34.36"
                  rx="32"
                  ry="31.36"
                  fill="white"
                  stroke="#E20613"
                  strokeWidth="5"
                />
                <path
                  d="M25.476 23.332H39.876L43.548 23.332C43.86 23.332 44.16 23.344 44.448 23.368C44.76 23.368 45.012 23.428 45.204 23.548C45.276 23.596 45.324 23.68 45.348 23.8C45.396 23.896 45.432 24.004 45.456 24.124V24.304C45.48 24.4 45.492 24.508 45.492 24.628C45.492 24.748 45.492 24.868 45.492 24.988V26.392C45.492 26.56 45.492 26.728 45.492 26.896C45.516 27.04 45.504 27.184 45.456 27.328C45.336 27.736 45.096 27.952 44.736 27.976C44.376 28 43.944 28.012 43.44 28.012L39.768 28.012C39.288 28.012 38.868 28.036 38.508 28.084C38.172 28.108 37.944 28.324 37.824 28.732C37.8 28.852 37.8 28.96 37.824 29.056C37.848 29.152 37.836 29.26 37.788 29.38C37.764 29.524 37.752 29.692 37.752 29.884C37.776 30.052 37.788 30.208 37.788 30.352V33.556L37.788 43.924V47.308C37.788 47.692 37.764 48.028 37.716 48.316C37.692 48.58 37.548 48.772 37.284 48.892C37.116 48.94 36.924 48.964 36.708 48.964C36.492 48.964 36.288 48.964 36.096 48.964H33.648C33.384 48.964 33.132 48.952 32.892 48.928C32.676 48.904 32.508 48.82 32.388 48.676C32.268 48.484 32.208 48.244 32.208 47.956C32.208 47.644 32.208 47.332 32.208 47.02V43.42L32.208 33.412V30.352C32.208 30.184 32.208 30.016 32.208 29.848C32.232 29.656 32.22 29.488 32.172 29.344C32.148 29.224 32.148 29.116 32.172 29.02C32.196 28.924 32.184 28.828 32.136 28.732C32.016 28.324 31.764 28.108 31.38 28.084C31.02 28.036 30.588 28.012 30.084 28.012H26.736C26.472 28.012 26.172 28.024 25.836 28.048C25.524 28.048 25.272 28.024 25.08 27.976C24.888 27.904 24.744 27.796 24.648 27.652C24.576 27.532 24.528 27.376 24.504 27.184C24.504 26.992 24.504 26.8 24.504 26.608V24.844C24.504 24.532 24.516 24.256 24.54 24.016C24.588 23.776 24.708 23.596 24.9 23.476C24.972 23.428 25.104 23.38 25.296 23.332C25.416 23.332 25.476 23.332 25.476 23.332Z"
                  fill="#E20613"
                />
              </svg>
            </div>
            <div className="App">
              <div id="local-container" style={{ display: "none" }}>
                <video
                  id="localVideo"
                  muted
                  style={{ display: "none" }}
                ></video>
              </div>
              <video
                className={`${styles.player_1_video} ${styles.player_video}`}
                id="ownVideoFeed"
                ref={this.ownVideoFeed}
                height={200}
                width={160}
                autoPlay
                muted
              />
              <div id="remote-container">
                <video
                  className={`${styles.player_2_video} ${styles.player_video}`}
                  id="remoteVideo"
                  height={200}
                  width={160}
                  muted
                />
              </div>
            </div>
          </div>
          <h2 className={styles.subtitle}>
            We zijn op zoek naar andere spelers, <br /> dit kan even duren.
          </h2>
        </div>
      </>
    );
  }
}

// export default inject(`store`)(observer(Socket));
export default SocketJoin;
