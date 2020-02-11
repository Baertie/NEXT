import React, { Component } from "react";
import { PropTypes, inject, observer } from "mobx-react";

import person from "../assets/img/testPerson.png";

import styles from "../styles/Scoreboard.module.css";

class Scoreboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div className={styles.full_wrapper}>
          <div className={styles.red_background}></div>
          <div className={styles.logo_next_white}></div>
          <div className={styles.own_score}>
            <h1 className={styles.title}>Je scoorde:</h1>
            <div className={styles.score_background}>
              <p className={styles.score_position}>19</p>
              <img className={styles.score_image} src={person} />
              <div className={styles.score_person}>
                <p className={styles.score_person_name}>Arno</p>
                <p className={styles.score_person_location}>Orroir</p>
              </div>
              <p className={styles.score_points}>220</p>
            </div>
          </div>
          <div className={styles.board_background}>
            <h2 className={styles.board_title}>De beste Nexters</h2>
            <div>
              {this.props.store.scores.map(
                (
                  { playerName, playerRegion, playerPicture, playerScore },
                  index
                ) => (
                  <div className={styles.board_item} key={`player_${index}`}>
                    <p className={styles.score_position}>{index + 1}</p>
                    <img className={styles.score_image} src={person} />
                    <div className={styles.score_person}>
                      <p className={styles.score_person_name}>{playerName}</p>
                      <p className={styles.score_person_location}>
                        {playerRegion}
                      </p>
                    </div>
                    <p className={styles.score_points}>{playerScore}</p>
                  </div>
                )
              )}

              {/* <div className={styles.board_item}>
                <p className={styles.score_position}>19</p>
                <img className={styles.score_image} src={person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>19</p>
                <img className={styles.score_image} src={person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>19</p>
                <img className={styles.score_image} src={person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div>
              <div className={styles.board_item}>
                <p className={styles.score_position}>19</p>
                <img className={styles.score_image} src={person} />
                <div className={styles.score_person}>
                  <p className={styles.score_person_name}>Arno</p>
                  <p className={styles.score_person_location}>Orroir</p>
                </div>
                <p className={styles.score_points}>220</p>
              </div> */}
            </div>
          </div>
          <div className={styles.regional}>
            <h2 className={styles.regional_title}>Regionale tussenstand</h2>
            <div className={styles.regional_grid}>
              {this.props.store.regioScores.map(({ regio, score }, index) => (
                <div className={styles.regional_item} key={`player_${index}`}>
                  <p className={styles.regional_item_region}>{regio}</p>
                  <p className={styles.regional_item_points}>{score}</p>
                </div>
              ))}
              {/* <div className={styles.regional_item}>
                <p className={styles.regional_item_region}>Kortrijk</p>
                <p className={styles.regional_item_points}>9011</p>
              </div>
              <div className={styles.regional_item}>
                <p className={styles.regional_item_region}>Kortrijk</p>
                <p className={styles.regional_item_points}>9011</p>
              </div>
              <div className={styles.regional_item}>
                <p className={styles.regional_item_region}>Kortrijk</p>
                <p className={styles.regional_item_points}>9011</p>
              </div>
              <div className={styles.regional_item}>
                <p className={styles.regional_item_region}>Kortrijk</p>
                <p className={styles.regional_item_points}>9011</p>
              </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default inject(`store`)(observer(Scoreboard));
