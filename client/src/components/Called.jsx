import React, { Component } from "react";
import { inject, PropTypes, observer } from "mobx-react";
import socketIOClient from "socket.io-client";

import styles from "../styles/Called.module.css";

class Connecting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTimer: null
    };
  }
  /*



*/
  componentDidMount() {
    // connect to socket
    this.clientSocket = socketIOClient(":8080");
    this.clientSocket.on("searchTimer", time => {
      console.log("searchTimer: ", time);
      this.setState({ searchTimer: time });
    });
    setInterval(() => {
      if (this.state.searchTimer > 0) {
        this.setState({ searchTimer: this.state.searchTimer - 1 });
      } else {
        // Geen tegenstanders gevonden binnen de tijd
      }
    }, 1000);
  }

  render() {
    return (
      <>
        <p style={{ fontStyle: "italic", fontSize: 15 }}>CALLED PAGE</p>
        <button onClick={() => this.props.store.startSocket()}>socket</button>
        <button onClick={this.answerCall}>Accept call</button>
        <p style={{ fontSize: 25 }}>Timer: {this.state.searchTimer}</p>
      </>
    );
    // return (
    //   <>
    //     <div className={styles.red_background}></div>
    //     <div className={styles.logo_next_white}></div>
    //     <div className={styles.search_timer}>
    //       <div className={styles.search_timer_text}>
    //         {this.state.searchTimer}
    //       </div>
    //       <svg className={styles.timer_svg}>
    //         <circle
    //           className={styles.timer_circle}
    //           r="40"
    //           cx="50"
    //           cy="50"
    //         ></circle>
    //       </svg>
    //     </div>
    //     <div className={styles.front_content}>
    //       <div className={styles.white_content_background_small}>
    //         <h1 className={styles.title_top}>
    //           je wordt uitgedaagd <br /> voor de{" "}
    //           <span className={styles.red_color}>next game</span>
    //         </h1>
    //       </div>
    //       <div className={styles.white_content_background_big}>
    //         <h1 className={styles.title_bot}>
    //           wat is de
    //           <span className={styles.red_color}> next game</span>?
    //         </h1>
    //         <ul>
    //           <li className={styles.game_info}>
    //             <div className={styles.game_info_left}>
    //               <h2 className={styles.game_subtitle}>1. verbind</h2>
    //               <p className={styles.game_info_text}>
    //                 Accepteer de uitnodiging.{" "}
    //                 <span className={styles.game_bold}>Verbind</span> met
    //                 spelers uit{" "}
    //                 <span className={styles.game_bold}>
    //                   Kortrijk, Lille, Tournai en Valenciennes.
    //                 </span>
    //               </p>
    //             </div>
    //             <div className={styles.game_info_1}></div>
    //           </li>
    //           <li className={styles.game_info}>
    //             <div className={styles.game_info_left}>
    //               <h2 className={styles.game_subtitle}>2. poseer</h2>
    //               <p className={styles.game_info_text}>
    //                 Beeld zo goed mogelijk <br /> de
    //                 <span className={styles.game_bold}>affiches</span> van NEXT
    //                 uit.
    //               </p>
    //             </div>
    //             <div className={styles.game_info_2}></div>
    //           </li>
    //           <li className={styles.game_info}>
    //             <div className={styles.game_info_left}>
    //               <h2 className={styles.game_subtitle}>3.win</h2>
    //               <p className={styles.game_info_text}>
    //                 Hoe beter je de <br /> affiches uitbeeldt, <br /> hoe meer{" "}
    //                 <span className={styles.game_bold}>punten</span> je <br />{" "}
    //                 verdient voor jouw{" "}
    //                 <span className={styles.game_bold}>regio</span>.
    //               </p>
    //             </div>
    //             <div className={styles.game_info_3}>
    //               <h3 className={styles.game_win_location}>Kortrijk</h3>
    //               <div className={styles.score_added}>+75</div>
    //             </div>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </>
    // );
  }
}

export default inject(`store`)(observer(Connecting));
