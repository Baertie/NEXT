import React, { Component } from "react";
import { PropTypes, inject, observer } from "mobx-react";
import Person from "../assets/img/testPerson.png";
import Arrow from "../assets/img/pijl.svg";

import styles from "../styles/TeamBoard.module.css";
import { socket } from "../App";

class TeamBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedPlayerScores: [],
      ownLocation: this.props.store.currentLocation
    };
  }
  componentDidMount() {
    socket.emit("regioinput");
    this.setState({ sortedPlayerScores: this.props.store.sortedPlayers });
  }

  render() {
    return (
      <div className={styles.full_wrapper}>
        <div className={styles.component_wrapper}>
          <div>
            <h1 className={styles.title}>Goed gespeeld!</h1>
            <p className={styles.board_text}>Dit is jullie tussenstand.</p>
          </div>
          <div className={styles.board_background}>
            <h2 className={styles.board_title}>Jullie scoorden:</h2>
            <div>
              {this.props.store.sortedPlayers.map(
                (
                  { installationLocation, score, playerName, playerImage },
                  index
                ) => (
                  <div
                    className={`${styles.board_item} ${
                      this.state.ownLocation === installationLocation
                        ? styles.ownStats
                        : ""
                    }`}
                    key={`player_${index}`}
                  >
                    <p className={styles.score_position}>{index + 1}</p>
                    <img className={styles.score_image} src={playerImage} />
                    <div className={styles.score_person}>
                      <p className={styles.score_person_name}>{playerName}</p>
                      <p
                        className={`${styles.score_person_location} ${styles[installationLocation]}`}
                      >
                        {installationLocation}
                      </p>
                    </div>
                    <p className={styles.score_points}>{score}</p>
                  </div>
                )
              )}
            </div>
          </div>
          <div>
            <p className={styles.board_text}>
              Voer jouw stad/gemeente hieronder in om jouw plaats op het globale
              scoreboard te zien.
            </p>
            <img className={styles.arrow} src={Arrow} />
          </div>
        </div>
      </div>
    );
  }
}

export default inject(`store`)(observer(TeamBoard));
