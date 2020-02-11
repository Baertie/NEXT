import React, { Component } from "react";
import "../styles/SocketTest.module.css";

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
  iceRestart: true
};

const config = {
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

class VideoTest extends Component {
  constructor(props) {
    super(props);
    this.video1 = React.createRef();
    this.video2 = React.createRef();
    this.video3 = React.createRef();
    this.state = {
      video: null,
      constraints: { audio: false, video: { width: 480, height: 720 } },
      searchTimer: 45
    };
  }
  componentDidMount() {
    this.startCall();
  }

  startCall = async () => {
    console.log("start call");
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(
        this.state.constraints
      );
      this.video1.current.srcObject = stream;

      console.log("video: ", this.video1.current.srcObject.getTracks());
      console.log("stream: ", stream.getTracks());
    } catch (err) {
      console.log("kapoet");
    }
  };

  answerCall = () => {
    console.log("answer call ");

    const videoTracks = this.video1.current.srcObject.getVideoTracks();
    if (videoTracks.length > 0) {
      console.log("video device: ", videoTracks[0].label);
    }

    const servers = null;
    this.pc1local = new RTCPeerConnection(servers);
    this.pc1remote = new RTCPeerConnection(servers);
    // console.log("state pc1local: ", this.pc1local.connectionState);
    // console.log("state pc1remote: ", this.pc1remote.connectionState);

    this.pc1remote.ontrack = this.gotRemoteStream1;

    this.pc1local.onicecandidate = this.iceCallback1Local;
    this.pc1remote.onicecandidate = this.iceCallback1Remote;
    console.log("pc1: created local and remote peer connection objects");

    this.pc2local = new RTCPeerConnection(servers);
    this.pc2remote = new RTCPeerConnection(servers);

    // console.log("state pc2local: ", this.pc2local.connectionState);
    // console.log("state pc2remote: ", this.pc2remote.connectionState);

    this.pc2remote.ontrack = this.gotRemoteStream2;

    this.pc2local.onicecandidate = this.iceCallback2Local;
    this.pc2remote.onicecandidate = this.iceCallback2Remote;
    console.log("pc2: created local and remote peer connection objects");

    this.pc1local.setConfiguration(config);
    console.log("state pc1local: ", this.pc1local.connectionState);

    this.pc2local.setConfiguration(config);
    console.log("state pc2local: ", this.pc2local.connectionState);

    this.video1.current.srcObject
      .getTracks()
      .forEach(track =>
        this.pc1local.addTrack(track, this.video1.current.srcObject)
      );
    console.log("Adding local stream to pc1local");

    this.pc1local
      .createOffer(offerOptions)
      .then(this.gotDescription1Local, this.onCreateSessionDescriptionError);

    // this.video1.current.srcObject
    //   .getTracks()
    //   .forEach(track =>
    //     this.pc2local.addTrack(track, this.video1.current.srcObject)
    //   );
    // console.log("Adding local stream to pc2local");

    // this.pc2local
    //   .createOffer(offerOptions)
    //   .then(this.gotDescription2Local, this.onCreateSessionDescriptionError);
  };

  gotRemoteStream1 = e => {
    console.log("gotRemoteStream1, e: ", e);
    if (this.video2.current.srcObject !== e.streams[0]) {
      this.video2.current.srcObject = e.streams[0];
      console.log("pc1: received remote stream");
    }
  };

  gotRemoteStream2 = e => {
    console.log("gotRemoteStream2, e: ", e);
    if (this.video3.current.srcObject !== e.streams[0]) {
      this.video3.current.srcObject = e.streams[0];
      console.log("pc2: received remote stream");
    }
  };

  iceCallback1Local = event => {
    this.handleCandidate(event.candidate, this.pc1remote, "pc1: ", "local");
  };

  iceCallback1Remote = event => {
    this.handleCandidate(event.candidate, this.pc1local, "pc1: ", "remote");
  };

  iceCallback2Local = event => {
    this.handleCandidate(event.candidate, this.pc2remote, "pc2: ", "local");
  };

  iceCallback2Remote = event => {
    this.handleCandidate(event.candidate, this.pc2local, "pc2: ", "remote");
  };

  handleCandidate = (candidate, dest, prefix, type) => {
    dest
      .addIceCandidate(candidate)
      .then(this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    console.log(
      `${prefix}New ${type} ICE candidate: ${
        candidate ? candidate.candidate : "(null)"
      }`
    );
  };

  onAddIceCandidateSuccess = () => {
    console.log("AddIceCandidate success.");
  };

  onAddIceCandidateError = error => {
    console.log(`Failed to add ICE candidate: ${error.toString()}`);
  };

  onCreateSessionDescriptionError = error => {
    console.log(`Failed to create session description: ${error.toString()}`);
  };

  gotDescription1Local = desc => {
    console.log("gotDescription1Local desc: ", desc);
    this.pc1local.setLocalDescription(desc);
    console.log(`Offer from pc1local\n${desc.sdp}`);
    this.pc1remote.setRemoteDescription(desc);
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    this.pc1remote
      .createAnswer()
      .then(this.gotDescription1Remote, this.onCreateSessionDescriptionError);
  };

  gotDescription1Remote = desc => {
    console.log("gotDescription1Remote desc: ", desc);
    this.pc1remote.setLocalDescription(desc);
    console.log(`Answer from pc1remote\n${desc.sdp}`);
    this.pc1remote.setRemoteDescription(desc);
  };

  gotDescription2Local = desc => {
    console.log("gotDescription2Local desc: ", desc);
    this.pc2local.setLocalDescription(desc);
    console.log(`Offer from pc2local\n${desc.sdp}`);
    this.pc2remote.setRemoteDescription(desc);
    this.pc2remote
      .createAnswer()
      .then(this.gotDescription2Remote, this.onCreateSessionDescriptionError);
  };

  gotDescription2Remote = desc => {
    console.log("gotDescription2Remote desc: ", desc);
    this.pc2remote.setLocalDescription(desc);
    console.log(`Answer from pc2remote\n${desc.sdp}`);
    this.pc2local.setRemoteDescription(desc);
  };

  stopCall = () => {
    console.log("stop call");
    this.pc1local.close();
    this.pc1remote.close();
    this.pc2local.close();
    this.pc2remote.close();
    this.pc1local = this.pc1remote = null;
    this.pc2local = this.pc2remote = null;
  };

  render() {
    return (
      <>
        <video ref={this.video1} id="video1" playsInline autoPlay muted></video>
        <video ref={this.video2} id="video2" playsInline autoPlay muted></video>
        <video ref={this.video3} id="video3" playsInline autoPlay muted></video>
        <div>
          {/* <button onClick={this.startCall}>start</button> */}
          <button onClick={this.answerCall}>answer</button>
          <button onClick={this.stopCall}>stop</button>
        </div>
      </>
    );
  }
}

export default VideoTest;
