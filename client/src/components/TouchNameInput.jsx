import React, { Component } from "react";
import styles from "../styles/TouchNameInput.module.css";
import basicStyles from "../styles/Touch.module.css";

import { inject, observer } from "mobx-react";

import LogoOverlayTablet from "../components/LogoOverlayTablet";
import { socket } from "../App";

class TouchNameInput extends Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ value: event.target.value });
    // console.log(this.state.value);
    socket.emit("namechange", event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();

    const currentLocation = this.props.store.currentLocation;

    switch (currentLocation) {
      case "kortrijk":
        console.log("set name voor kortrijk");
        socket.emit("setNameKortrijk", this.state.value);
        socket.emit("gametutorial");
        socket.emit("playerInputNameFinished");
        break;
      case "tournai":
        console.log("set name voor tournai");
        socket.emit("setNameTournai", this.state.value);
        socket.emit("gametutorial");
        socket.emit("playerInputNameFinished");
        break;
      case "lille":
        console.log("set name voor lille");
        socket.emit("setNameLille", this.state.value);
        socket.emit("gametutorial");
        socket.emit("playerInputNameFinished");
        break;
      case "valenciennes":
        console.log("set name voor valenciennes");
        socket.emit("setNameValenciennes", this.state.value);
        socket.emit("gametutorial");
        socket.emit("playerInputNameFinished");
        break;
    }
  }

  render() {
    return (
      <div className={basicStyles.container}>
        <LogoOverlayTablet />
        <form onSubmit={this.handleSubmit} className={styles.formContainer}>
          <div className={styles.inputContainer}>
            <label htmlFor="nameInput" className={styles.label}>
              Naam
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Vul hier jouw naam in"
              id="nameInput"
              autoFocus
              ref={this.nameInput}
              onChange={this.handleChange}
              value={this.state.value}
            />
          </div>
          <input
            className={styles.submit}
            type="submit"
            value="Dit is mijn naam!"
          />
        </form>
      </div>
    );
  }
}

// export default TouchNameInput;
export default inject(`store`)(observer(TouchNameInput));
