import React, { Component } from "react";
import Person from "../assets/img/testPerson.png";
import Arrow from "../assets/img/pijl.svg";

import styles from "../styles/TeamBoard.module.css";

class TeamBoard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className={styles.full_wrapper}>
          <div>
            <h2 className={styles.board_title}>Goed gespeeld!</h2>
            <p className={styles.board_text}>Dit is jullie tussenstand.</p>
          </div>
          <div className={styles.board_background}>
            <h2 className={styles.board_title}>Jullie scoorden:</h2>
            <div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>1</p>
                <img className={styles.score_image} src={Person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item_border}></div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>2</p>
                <img className={styles.score_image} src={Person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>3</p>
                <img className={styles.score_image} src={Person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>4</p>
                <img className={styles.score_image} src={Person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
            </div>
          </div>
          <div>
            <p className={styles.board_text}>
              Voer jouw regio hieronder in om jouw plaats op het globale
              scoreboard te zien.
            </p>
            <img className={styles.pijl} src={Arrow} />
          </div>
        </div>
      </>
    );
  }
}

export default TeamBoard;
