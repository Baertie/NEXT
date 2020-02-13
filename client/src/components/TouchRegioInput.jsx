import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import styles from "../styles/TouchNameInput.module.css";
import basicStyles from "../styles/Touch.module.css";

import LogoOverlayTablet from "../components/LogoOverlayTablet";
import { socket } from "../App";

class TouchRegioInput extends Component {
  constructor(props) {
    super(props);
    this.regioInput = React.createRef();
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit("setRegio", this.state.value);
    console.log("regio gezet");
  }
  render() {
    return (
      <div className={basicStyles.container}>
        <LogoOverlayTablet />
        <form onSubmit={this.handleSubmit} className={styles.formContainer}>
          <div className={styles.inputContainer}>
            <label htmlFor="regioInput" className={styles.label}>
              Woonplaats
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="Vul hier jouw stad/gemeente in"
              id="regioInput"
              autoFocus
              ref={this.regioInput}
              onChange={this.handleChange}
              value={this.state.value}
            />
          </div>
          <input className={styles.submit} type="submit" value="Toevoegen" />
        </form>
      </div>
    );
  }
}

export default inject(`store`)(observer(TouchRegioInput));
