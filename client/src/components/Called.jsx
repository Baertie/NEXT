import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";
import socketIOClient from "socket.io-client";
class Connecting extends Component {
  constructor(props) {
    super(props);
    // this.videoTag = React.createRef();
    // this.state = {
    //   video: null
    // };
  }

  componentDidMount() {
    // getting access to webcam
    // navigator.mediaDevices
    //   .getUserMedia({ video: true })
    //   .then(stream => (this.videoTag.current.srcObject = stream))
    //   .catch(console.log("failed to get user media"));
  }

  render() {
    return (
      <>
        <p>Deze man daagt je uit!</p>
        {/* <video
          style={{
            position: "absolute",
            top: "100px",
            left: "50px",
            height: "720",
            width: "480",
            objectFit: "cover"
          }}
          id="videoTag"
          ref={this.videoTag}
          width={480}
          height={720}
          autoPlay
          muted
        ></video> */}
      </>
    );
  }
}

export default inject(`store`)(observer(Connecting));
