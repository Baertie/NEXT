import React, { Component } from "react";

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
      posterIndex: 0
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), this.props.timeOut);
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
      <img src={this.state.posterArray[this.state.posterIndex]} alt=""></img>
    );
  }
}

export default Postercarousel;
