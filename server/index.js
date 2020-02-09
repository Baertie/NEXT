var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const port = process.env.PORT || 8080;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

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

    socket.on("onboarding", () => {
      io.to(room).emit("onboarding");
      console.log("onboarding matjes");
    });

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
  });

  socket.on("stopCarousel", () => {
    // socket.to("BAPNEXT").emit("newPeerConnection");
    socket.broadcast.emit("stopCarousel");
  });

  // TIMER WERKT
  socket.on("searchTimer", time => {
    socket.broadcast.emit("searchTimer", time);
  });

  socket.on("newPeerJoined", () => {
    socket.broadcast.emit("newPeerJoined");
  });

  socket.on("peerAnswered", () => {
    socket.broadcast.emit("peerAnswered");
  });

  socket.on("sendCall", test => {
    console.log("test: ", test);
    socket.broadcast.emit("peerWantsACall");
  });

  // ENKEL PEER TO PEER
  const room = "BAPNEXT";
  const join = room => {
    // Count clients in room
    const clientCount =
      typeof io.sockets.adapter.rooms[room] !== "undefined"
        ? io.sockets.adapter.rooms[room].length
        : 0;
    // Check if client can join to the room
    if (clientCount < 3) {
      socket.join(room);
      socket.emit("join", { clientCount: clientCount + 1 });
      console.log("Joined to room!");
    } else {
      console.log("Room is full!");
    }
  };
  join(room);
  socket.on("signaling", message => {
    socket.to(room).emit("signaling", message);
  });
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
