import React, { Component } from "react";
// import { inject, PropTypes, observer } from "mobx-react";
import { socket } from "../App.js";

import styles from "../styles/Onboarding.module.css";
class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 0
    };
  }
  componentDidMount() {
    socket.emit("onboarding");

    socket.on("prevOnboardingPage", () => {
      this.handlePrevClick();
    });

    socket.on("nextOnboardingPage", () => {
      this.handleNextClick();
    });
  }

  handleResetClick = e => {
    console.log("reset");
    this.props.store.resetEverything();
  };

  handleNextClick = () => {
    console.log("next");
    if (this.state.screen < 2) {
      this.setState({ screen: this.state.screen + 1 });
    }
  };

  handlePrevClick = () => {
    console.log("prev");
    if (this.state.screen > 0) {
      this.setState({ screen: this.state.screen - 1 });
    }
  };

  handleStartClick = () => {
    console.log("start verbinden man");
    // this.props.store.startConnecting();
    // this.props.store.startSocket();
    this.props.history.push("/startConnecting");
  };

  render() {
    switch (this.state.screen) {
      case 0:
        return (
          <>
            <div className={styles.red_background}></div>
            <div className={styles.logo_next_white}></div>
            <div className={styles.front_content}>
              <div className={styles.white_content_background}>
                <h1 className={styles.onboarding_title}>Speel samen</h1>
                <div className={styles.map_img}></div>
              </div>
              <h2 className={styles.onboarding_subtitle}>
                Verbind met andere mensen <br /> uit de Eurometropool
              </h2>
              <p className={styles.onboarding_extra_info}>
                Strijd tegen de verschillende regio’s <br /> van de
                Eurometropool
              </p>
              <div className={styles.page_steps_wrapper}>
                <div className={styles.page_number_active}></div>
                <div className={styles.page_number}></div>
                <div className={styles.page_number}></div>
              </div>
            </div>
            <button className={styles.test} onClick={this.handlePrevClick}>
              Previous step
            </button>
            <button className={styles.test2} onClick={this.handleNextClick}>
              Next step
            </button>
          </>
        );
      case 1:
        return (
          <>
            <div className={styles.red_background}></div>
            <div className={styles.logo_next_white}></div>
            <div className={styles.front_content}>
              <div className={styles.white_content_background}>
                <h1 className={styles.onboarding_title}>
                  Maak de beste poster
                </h1>
                <div className={styles.score_wrapper}>
                  <div>
                    <div className={styles.score_affiche}></div>
                  </div>
                  <div>
                    <div className={styles.score_eigen_beeld}></div>
                    <div className={styles.score_added}>+75</div>
                  </div>
                </div>
              </div>
              <h2 className={styles.onboarding_subtitle}>
                Hoe beter je poseert, <br /> hoe meer punten je verdient!
              </h2>
              <p className={styles.onboarding_extra_info}>
                Behaal jij het meeste punten? <br /> Dan word je misschien het
                nieuwe gezicht van NEXT!
              </p>
              <div className={styles.page_steps_wrapper}>
                <div className={styles.page_number}></div>
                <div className={styles.page_number_active}></div>
                <div className={styles.page_number}></div>
              </div>
            </div>
            <button className={styles.test} onClick={this.handlePrevClick}>
              Previous step
            </button>
            <button className={styles.test2} onClick={this.handleNextClick}>
              Next step
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div className={styles.red_background}></div>
            <div className={styles.logo_next_white}></div>
            <div className={styles.front_content}>
              <div className={styles.white_content_background}>
                <h1 className={styles.onboarding_title}>Scoor punten</h1>
                <ol className={styles.scoreboard_list}>
                  <li className={styles.scoreboard_list_item}>
                    <span className={styles.scoreboard_standing}>1</span>
                    <span className={styles.scoreboard_location}>Kortrijk</span>
                    <span className={styles.scoreboard_points}>321</span>
                  </li>
                  <li className={styles.scoreboard_list_item}>
                    <span className={styles.scoreboard_standing}>2</span>
                    <span className={styles.scoreboard_location}>Tournai</span>
                    <span className={styles.scoreboard_points}>312</span>
                  </li>
                  <li className={styles.scoreboard_list_item}>
                    <span className={styles.scoreboard_standing}>3</span>
                    <span className={styles.scoreboard_location}>
                      Valenciennes
                    </span>
                    <span className={styles.scoreboard_points}>284</span>
                  </li>
                  <li className={styles.scoreboard_list_item}>
                    <span className={styles.scoreboard_standing}>4</span>
                    <span className={styles.scoreboard_location}>Lille</span>
                    <span className={styles.scoreboard_points}>265</span>
                  </li>
                </ol>
              </div>
              <h2 className={styles.onboarding_subtitle}>
                Maak jouw regio nummer 1 <br /> in de Eurometropool
              </h2>
              <p className={styles.onboarding_extra_info}>
                Verdien punten voor jouw regio en word <br /> de beste regio!
              </p>
              <div className={styles.page_steps_wrapper}>
                <div className={styles.page_number}></div>
                <div className={styles.page_number}></div>
                <div className={styles.page_number_active}></div>
              </div>
            </div>
            <button className={styles.test} onClick={this.handlePrevClick}>
              Previous step
            </button>
            <button className={styles.test2} onClick={this.handleStartClick}>
              Start game
            </button>
          </>
        );
    }
  }
}

// export default inject(`store`)(observer(Onboarding));
export default Onboarding;
