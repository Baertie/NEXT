const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 8080;

require("dotenv").config();

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("db connected"))
  .catch(e => {
    console.log("Error, exiting", e);
    process.exit();
  });

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ extended: true, limit: "50mb" }));

require("./app/routes/scores.routes.js")(app);
require("./app/routes/regioscores.routes.js")(app);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.get("/api/data", (req, res) => {
  res.send({ message: "ok", secret: process.env.SECRET });
});

var timerStarted = false;

io.on("connection", socket => {
  console.log("new connection - socket id:", socket.id);

  socket.on("joinLocationRoom", room => {
    socket.join(room);
    console.log("joined the room in: ", room);
    console.log("room count: ", io.sockets.adapter.rooms[room].length);

    // trigger landing page
    socket.on("landing", () => {
      io.to(room).emit("landing");
      console.log("landing", room);
    });

    // trigger onboarding page
    socket.on("onboarding", () => {
      io.to(room).emit("onboarding");
      console.log("onboarding", room);
    });

    // flip through the onboarding pages
    socket.on("nextOnboardingPage", () => {
      io.to(room).emit("nextOnboardingPage");
      console.log("next page");
    });

    socket.on("startGame", () => {
      io.to(room).emit("startGame");
      console.log("start game", room);
    });

    socket.on("prevOnboardingPage", () => {
      io.to(room).emit("prevOnboardingPage");
      console.log("previous page");
    });

    // trigger connecting page
    socket.on("banaan", () => {
      io.to(room).emit("banaan");
      console.log("banaan", room);
    });

    socket.on("namechange", namevalue => {
      io.to(room).emit("namechange", namevalue);
      //   console.log("namevalue", namvevalue);
    });

    // trigger called page
    socket.on("called", () => {
      io.to(room).emit("called");
      console.log("called", room);
    });

    // trigger nameinput page
    socket.on("nameinput", () => {
      io.to(room).emit("nameinput");
      console.log("nameinput", room);
    });

    // trigger game page
    socket.on("game", () => {
      io.to(room).emit("game");
      console.log("game", room);
    });

    // trigger regioinput page
    socket.on("regioinput", () => {
      io.to(room).emit("regioinput");
      console.log("regioinput", room);
    });

    socket.on("setNameKortrijk", name => {
      console.log("emit kortrijk name", name);
      io.emit("setNameKortrijk", name);
    });
    socket.on("setNameLille", name => {
      console.log("emit lille name", name);
      io.emit("setNameLille", name);
    });
    socket.on("setNameTournai", name => {
      console.log("emit tournai name", name);
      io.emit("setNameTournai", name);
    });
    socket.on("setNameValenciennes", name => {
      console.log("emit valenciennes name", name);
      io.emit("setNameValenciennes", name);
    });

    // trigger gdpr page
    socket.on("gdpr", () => {
      io.to(room).emit("gdpr");
      console.log("gdpr", room);
    });

    socket.on("gameTimer", time => {
      io.to(room).emit("gameTimer", time);
    });

    // trigger leaderboard page
    socket.on("leaderboard", () => {
      io.to(room).emit("leaderboard");
      console.log("leaderboard", room);
    });

    socket.on("gametutorial", () => {
      io.to(room).emit("gametutorial");
      console.log("gametutorial", room);
    });

    socket.on("setRegio", regio => {
      io.to(room).emit("setRegio", regio);
      console.log("setRegio", room);
    });

    socket.on("addtodatabase", () => {
      io.to(room).emit("addtodatabase");
      console.log("addtodatabase", room);
    });
  });

  socket.on("resetSocketVariables", () => {
    timerStarted = false;
    console.log("reset socket timer", timerStarted);
  });

  socket.on("startOnboardingTimer", () => {
    console.log("in start onboardingtimer");
    if (timerStarted === false) {
      socket.emit("startOnboardingTimer");
      timerStarted = true;
    } else {
      console.log("timer al gestart");
    }
  });

  socket.on("playerInputNameFinished", () => {
    if (timerStarted === false) {
      socket.broadcast.emit("startOnboardingTimer");
      timerStarted = true;
    } else {
      console.log("timer al gestart");
    }
    console.log("wow in de if count: ");
  });

  socket.on("playerInputTimerEnded", () => {
    socket.broadcast.emit("startSecondTutorialTimer");
  });

  socket.on("stopCarousel", () => {
    socket.broadcast.emit("stopCarousel");
  });

  // TIMER WERKT
  socket.on("searchTimer", time => {
    socket.broadcast.emit("searchTimer", time);
  });
  socket.on("playerCalled", time => {
    socket.broadcast.emit("playerCalled", time);
  });

  socket.on("joinGame", () => {
    socket.broadcast.emit("joinGame");
  });

  socket.on("sendImg", ({ location, image }) => {
    socket.broadcast.emit("sendImg", {
      location,
      image
    });
  });

  socket.on("imgKortrijk", img => {
    socket.broadcast.emit("imgKortrijk", img);
  });
  socket.on("imgLille", img => {
    socket.broadcast.emit("imgLille", img);
  });
  socket.on("imgTournai", img => {
    socket.broadcast.emit("imgTournai", img);
  });
  socket.on("imgValenciennes", img => {
    socket.broadcast.emit("imgValenciennes", img);
  });

  socket.on("scoreKortrijk", score => {
    socket.broadcast.emit("scoreKortrijk", score);
  });
  socket.on("scoreLille", score => {
    socket.broadcast.emit("scoreLille", score);
  });
  socket.on("scoreTournai", score => {
    socket.broadcast.emit("scoreTournai", score);
  });
  socket.on("scoreValenciennes", score => {
    socket.broadcast.emit("scoreValenciennes", score);
  });
});

http.listen(port, () => {
  require("./get-ip-addresses")().then(ipAddresses => {
    if (ipAddresses.en0) {
      connectionUrl = `https://${ipAddresses.en0[0]}:${port}`;
    } else {
      connectionUrl = `http://localhost:${port}`;
    }
    console.log(`Server running: ${connectionUrl}`);
  });
});
