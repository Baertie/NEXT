var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  //    // keeping track of all users
  //   users[socket.id] = {
  //     peers: {}
  //   };
  //   io.to(socket.id).emit('connectionUrl', connectionUrl);

  //   // New connection - will be called by beamer
  //   // -- Broadcast = sending to all clients except sender
  //   socket.broadcast.emit('peerConnection', socket.id);

  //   // Sending all users, so beamer can call them (projector project)
  //   // -- sending to individual socketid(private message)
  //   io.to(socket.id).emit('users', users);

  //   // NEW: beamer app wants to be called
  //   socket.on('peerWantsACall', (peerId) => {
  //     if (!users[peerId]) {
  //       return;
  //     }
  //     io.to(peerId).emit('peerWantsACall', socket.id);
  //   });

  //   // Beamer asks to call a specific peer
  //   socket.on('peerOffer', (peerId, offer = false) => {
  //     if (!users[peerId]) {
  //       return;
  //     }
  //     if (!offer) {
  //       return;
  //     }
  //     io.to(peerId).emit('peerOffer', socket.id, offer);
  //   });

  //   // Peer sends an answer to beamer
  //   socket.on('peerAnswer', (peerId, answer = false) => {
  //     if (!users[peerId]) {
  //       return;
  //     }
  //     if (!answer) {
  //       return;
  //     }
  //     io.to(peerId).emit('peerAnswer', socket.id, answer);
  //     // link these two users together
  //     users[socket.id].peers[peerId] = true;
  //     users[peerId].peers[socket.id] = true;
  //   });

  //   // ICE candidate arrives
  //   socket.on('peerIce', (peerId, candidate = false) => {
  //     if (!users[peerId]) {
  //       return;
  //     }
  //     if (!candidate) {
  //       return;
  //     }
  //     io.to(peerId).emit('peerIce', socket.id, candidate);
  //   });

  //   socket.on('disconnect', () => {
  //     notifyPeersOfDisconnect(socket.id);
  //     removeSocketIdFromUsers(socket.id);
  //     io.sockets.emit('userDisconnect', socket.id);
  //   });

  // });
});

http.listen(4000, function() {
  console.log("listening on *:4000");
});
