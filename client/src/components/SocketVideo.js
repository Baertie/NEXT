import socketIO from "socket.io-client";
const socket = socketIO("http://localhost:8080", { transports: ["websocket"] });

const join = callback => {
  // Listen for 'join' messages
  socket.on("join", message => {
    callback(message);
    // console.log("join in socketvideo");
  });
};

const signaling = callback => {
  // Listen for 'signaling' messages
  socket.on("signaling", message => {
    // console.log("signaling in socketvideo: ", message);
    callback(message);
  });
};

const send = (channel, message) => {
  // Send message to server
  socket.emit(channel, message);
  // console.log("emit socket, channel: ", channel, " . Message: ", message);
};

export { join, signaling, send };
