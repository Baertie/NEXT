import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";
import socketIOClient from "socket.io-client";

class Postercarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterArray: [
        "http://jannesdegreve.be/next/posters/affiche_1",
        "http://jannesdegreve.be/next/posters/affiche_2",
        "http://jannesdegreve.be/next/posters/affiche_3",
        "http://jannesdegreve.be/next/posters/affiche_4",
        "http://jannesdegreve.be/next/posters/affiche_5",
        "http://jannesdegreve.be/next/posters/affiche_6",
        "http://jannesdegreve.be/next/posters/affiche_7"
      ],
      posterIndex: 0,
      isBeingCalled: false
    };
    // this._isMounted = true;
  }

  componentDidMount() {
    // this._isMounted = true;
    this.timerID = setInterval(() => this.tick(), this.props.timeOut);

    this.clientSocket = socketIOClient(":8080");

    this.clientSocket.on("connect", () => {
      // Gettin the users clientSocket id
      console.log("clientSocket id", this.clientSocket.id);
    });

    // When a call comes in
    this.clientSocket.on("newPeerConnection", () => {
      this.state.isBeingCalled = true;
    });
  }

  componentDidUpdate() {
    // This check is needed because this will now only happen on this screen.
    if (this.state.isBeingCalled === true) {
      this.props.store.getCalled();
    }
  }

  componentWillUnmount() {
    // this._isMounted = false;
    clearInterval(this.timerID);
  }

  tick() {
    if (this.state.posterIndex < this.state.posterArray.length - 1) {
      this.setState({ posterIndex: this.state.posterIndex + 1 });
    } else {
      this.setState({ posterIndex: 0 });
    }
  }

  render() {
    return (
      <img
        src={this.state.posterArray[this.state.posterIndex]}
        alt=""
        style={{ width: "100%", height: "auto" }}
      ></img>
    );
  }
}

export default inject(`store`)(observer(Postercarousel));
