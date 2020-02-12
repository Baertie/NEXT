const mongoose = require("mongoose");

const ScoreSchema = mongoose.Schema({
  playerName: String,
  playerRegion: String,
  playerPicture: String,
  playerScore: Number,
  installationLocation: String
});

module.exports = mongoose.model("Score", ScoreSchema);
