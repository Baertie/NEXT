const mongoose = require("mongoose");

const RegioscoreSchema = mongoose.Schema({
  regio: String,
  score: Number
});

module.exports = mongoose.model("Regioscore", RegioscoreSchema);
