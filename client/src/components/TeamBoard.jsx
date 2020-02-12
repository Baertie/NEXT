import React, { Component } from "react";
import { PropTypes, inject, observer } from "mobx-react";
import Person from "../assets/img/testPerson.png";
import Arrow from "../assets/img/pijl.svg";

import styles from "../styles/TeamBoard.module.css";

class TeamBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortedPlayerScores: [],
      ownLocation: this.props.store.currentLocation
    };
  }
  componentDidMount() {
    const unsortedScores = this.props.store.sortedScores;

    this.setSortedScores(unsortedScores);
  }

  setSortedScores = unsortedScores => {
    this.setState({
      sortedPlayerScores: unsortedScores.sort((a, b) => {
        return b.score - a.score;
      })
    });
  };
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
              {this.state.sortedPlayerScores.map(
                ({ installationLocation, score }, index) => (
                  <div
                    className={`${styles.board_item} ${
                      this.state.ownLocation === installationLocation
                        ? styles.ownStats
                        : ""
                    }`}
                    key={`player_${index}`}
                  >
                    <p className={styles.score_position}>{index + 1}</p>
                    <img className={styles.score_image} src={Person} />
                    <div className={styles.score_person}>
                      <p className={styles.score_person_name}>Arno</p>
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
              Voer jouw regio hieronder in om jouw plaats op het globale
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
