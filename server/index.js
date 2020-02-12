var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const port = process.env.PORT || 8080;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.set("origins", "*:*");
io.on("connection", socket => {
  users[socket.id] = {
    peers: {}
  };

  // console.log("users socket.id: ", users[socket.id]);
  console.log("new connection - socket id:", socket.id);

  socket.on("joinLocationRoom", room => {
    socket.join(room);
    console.log("joined the room in: ", room);
    console.log("room count: ", io.sockets.adapter.rooms[room].length);

    // trigger onboarding page
    socket.on("onboarding", () => {
      io.to(room).emit("onboarding");
      console.log("onboarding");
    });

    // flip through the onboarding pages
    socket.on("nextOnboardingPage", () => {
      io.to(room).emit("nextOnboardingPage");
      console.log("next page");
    });
    socket.on("startGame", () => {
      io.to(room).emit("startGame");
      console.log("start game");
    });

    socket.on("prevOnboardingPage", () => {
      io.to(room).emit("prevOnboardingPage");
      console.log("previous page");
    });

    // trigger connecting page
    socket.on("connecting", () => {
      io.to(room).emit("connecting");
      console.log("connecting");
    });

    // trigger called page
    socket.on("called", () => {
      io.to(room).emit("called");
      console.log("called");
    });

    // trigger nameinput page
    socket.on("nameinput", () => {
      io.to(room).emit("nameinput");
      console.log("nameinput");
    });

    // trigger game page
    socket.on("game", () => {
      io.to(room).emit("game");
      console.log("game");
    });

    // trigger regioinput page
    socket.on("regioinput", () => {
      io.to(room).emit("regioinput");
      console.log("regioinput");
    });

    // trigger gdpr page
    socket.on("gdpr", () => {
      io.to(room).emit("gdpr");
      console.log("gdpr");
    });

    socket.on("gameTimer", time => {
      io.to(room).emit("gameTimer", time);
    });

    // trigger leaderboard page
    socket.on("leaderboard", () => {
      io.to(room).emit("leaderboard");
      console.log("leaderboard");
    });
  });

  socket.on("stopCarousel", () => {
    // socket.to("BAPNEXT").emit("newPeerConnection");
    socket.broadcast.emit("stopCarousel");
  });

  // TIMER WERKT
  socket.on("searchTimer", time => {
    socket.broadcast.emit("searchTimer", time);
  });
  socket.on("playerCalled", time => {
    socket.broadcast.emit("playerCalled", time);
  });

  socket.on("joinGame", location => {
    socket.broadcast.emit("joinGame", location);
  });

  socket.on("sendImg", ({ location, image }) => {
    socket.broadcast.emit("sendImg", { location, image });
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
  // ENKEL PEER TO PEER
  // const room = "BAPNEXT";
  // const join = room => {
  //   // Count clients in room
  //   const clientCount =
  //     typeof io.sockets.adapter.rooms[room] !== "undefined"
  //       ? io.sockets.adapter.rooms[room].length
  //       : 0;
  //   // Check if client can join to the room
  //   if (clientCount < 3) {
  //     socket.join(room);
  //     socket.emit("join", { clientCount: clientCount + 1 });
  //     console.log("Joined to room!");
  //   } else {
  //     console.log("Room is full!");
  //   }
  // };
  // join(room);
  // socket.on("signaling", message => {
  //   socket.to(room).emit("signaling", message);
  // });
});

// http.listen(8080, function() {
//   console.log("listening on *:3000");
// });

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

/* 
io.on("connection", socket => {
  // console.log("a user connected: ", socket.id);

  // keeping track of all users
  users[socket.id] = {
    peers: {}
  };
  // console.log(users);
  // io.sockets.clients() toont meer info over alle verbonden sockets
  // console.log("alle clients", io.sockets.clients());
  io.to(socket.id).emit("connectionUrl", connectionUrl);

  // New connection - will be called by beamer
  // -- Broadcast = sending to all clients except sender

  // Updated
  // When a user sends a peerconnection 1/2
  // the server sends a new peerconnection to all users 2/2
  socket.on("peerConnection", () => {
    socket.broadcast.emit("newPeerConnection", socket.id);
  });

  // Sending all users, so beamer can call them (projector project)
  // -- sending to individual socketid(private message)
  io.to(socket.id).emit("users", users);

  // NEW: beamer app wants to be called
  socket.on("peerWantsACall", peerId => {
    if (!users[peerId]) {
      return;
    }
    io.to(peerId).emit("peerWantsACall", socket.id);
  });

  // Beamer asks to call a specific peer
  socket.on("peerOffer", (peerId, offer = false) => {
    if (!users[peerId]) {
      return;
    }
    if (!offer) {
      return;
    }
    io.to(peerId).emit("peerOffer", socket.id, offer);
  });

  // Peer sends an answer to beamer
  socket.on("peerAnswer", (peerId, answer = false) => {
    if (!users[peerId]) {
      return;
    }
    if (!answer) {
      return;
    }
    io.to(peerId).emit("peerAnswer", socket.id, answer);
    // link these two users together
    users[socket.id].peers[peerId] = true;
    users[peerId].peers[socket.id] = true;
  });

  // ICE candidate arrives
  socket.on("peerIce", (peerId, candidate = false) => {
    if (!users[peerId]) {
      return;
    }
    if (!candidate) {
      return;
    }
    io.to(peerId).emit("peerIce", socket.id, candidate);
  });

  socket.on("disconnect", () => {
    notifyPeersOfDisconnect(socket.id);
    removeSocketIdFromUsers(socket.id);
    io.sockets.emit("userDisconnect", socket.id);
  });
});

const notifyPeersOfDisconnect = socketId => {
  if (!users[socketId]) {
    return;
  }
  for (let peerId in users[socketId].peers) {
    io.to(peerId).emit("peerDisconnect", socketId);
  }
};

const removeSocketIdFromUsers = socketId => {
  if (!users[socketId]) {
    return;
  }
  for (let peerId in users[socketId].peers) {
    if (!users[peerId]) {
      continue;
    }
    delete users[peerId].peers[socketId];
  }
  delete users[socketId];
};

// http.listen(4000, function() {
//   console.log("listening on *:4000");
// });

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


*/
