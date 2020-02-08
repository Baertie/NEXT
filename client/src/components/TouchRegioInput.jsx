import React, { Component } from "react";

class TouchRegioInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <form action="">
        <label htmlFor="nameInput">Regio</label>
        <input
          type="text"
          id="nameInput"
          placeholder="Vul hier jouw regio in"
        ></input>
        <input type="submit">Toevoegen</input>
      </form>
    );
  }
}

export default TouchRegioInput;
