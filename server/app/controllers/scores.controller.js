const Score = require("../models/score.model.js");

exports.create = (req, res) => {
  if (!req.body.playerName) {
    return res.status(500).send({ err: "playerName can not be empty" });
  }

  if (!req.body.playerRegion) {
    return res.status(500).send({ err: "playerRegion can not be empty" });
  }

  if (!req.body.playerPicture) {
    return res.status(500).send({ err: "playerPicture can not be empty" });
  }

  if (!req.body.playerScore) {
    return res.status(500).send({ err: "playerScore can not be empty" });
  }

  if (!req.body.installationLocation) {
    return res
      .status(500)
      .send({ err: "installationLocation can not be empty" });
  }

  const score = new Score({
    playerName: req.body.playerName,
    playerRegion: req.body.playerRegion,
    playerPicture: req.body.playerPicture,
    playerScore: req.body.playerScore,
    installationLocation: req.body.installationLocation
  });

  score
    .save()
    .then(score => res.send(score))
    .catch(err => {
      res.status(500).send({ error: err.score || "Error" });
    });
};

exports.findAll = async (req, res) => {
  try {
    const scores = await Score.find();
    res.send(scores);
  } catch (err) {
    res.status(500).send({ err: err.score || "Error" });
  }
};

exports.getLimited = async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ playerScore: -1 })
      .limit(5);
    res.send(scores);
  } catch (err) {
    res.status(500).send({ err: err.score || "Error" });
  }
};

// exports.findOne = async (req, res) => {
//   try {
//     const score = await Score.findOne({
//       _id: req.params.scoreId
//     });
//     if (score) {
//       res.send(score);
//     } else {
//       res.status(404).send("No score found");
//     }
//   } catch (err) {
//     if (err.kind === "ObjectId") {
//       return res.status(500).send("Geen geldig ID");
//     }
//     return res.status(500).send(err);
//   }
// };

// exports.update = async (req, res) => {
//   if (!req.body.name) {
//     return res.status(400).send("name mag niet leeg zijn");
//   }

//   try {
//     const score = await Score.findOneAndUpdate(
//       {
//         _id: req.params.scoreId
//       },
//       {
//         name: req.body.name,
//         price: req.body.price
//       },
//       {
//         new: true
//       }
//     );

//     if (!score) {
//       return res.status(404).send("No score found");
//     }
//     res.send(score);
//   } catch (err) {
//     if (err.kind === "ObjectId") {
//       return res.status(417).send("Geen geldig ID");
//     }
//     return res.status(500).send(err);
//   }
// };

exports.delete = async (req, res) => {
  try {
    const score = await Score.findOneAndRemove({
      _id: req.params.scoreId
    });
    if (!score) {
      return res.status(404).send("No score found");
    }
    res.send(score);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(417).send("Geen geldig ID");
    }
    return res.status(500).send(err);
  }
};
