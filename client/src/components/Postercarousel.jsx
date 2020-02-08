import React, { Component } from "react";
// import { inject, PropTypes, observer } from "mobx-react";
import socketIOClient from "socket.io-client";

import carousel1 from "../assets/img/carousel/carousel1.jpg";
import carousel2 from "../assets/img/carousel/carousel2.jpg";
import carousel3 from "../assets/img/carousel/carousel3.jpg";

class Postercarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterArray: [carousel1, carousel2, carousel3],
      posterIndex: 0,
      isBeingCalled: false
    };
    // this._isMounted = true;
  }

  componentDidMount() {
    // this._isMounted = true;
    this.timerID = setInterval(() => this.tick(), this.props.timeOut);
    this.clientSocket = socketIOClient(":8080");
    // When a call comes in
    this.clientSocket.on("stopCarousel", () => {
      console.log("stop carousel er wordt gebeld POSTERCAROUSEL");
      this.state.isBeingCalled = true;
    });
  }

  componentDidUpdate() {
    // This check is needed because this will now only happen on this screen.
    if (this.state.isBeingCalled === true) {
      console.log("minder direct bro");
      this.props.onCall();
    }
  }

  componentWillUnmount() {
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

// export default inject(`store`)(observer(Postercarousel));
export default Postercarousel;
