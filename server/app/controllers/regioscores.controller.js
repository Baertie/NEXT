const Regioscore = require("../models/regioscore.model.js");

// exports.create = (req, res) => {
//   if (!req.body.regio) {
//     return res.status(500).send({ err: "regio can not be empty" });
//   }

//   if (!req.body.playerRegion) {
//     return res.status(500).send({ err: "playerRegion can not be empty" });
//   }

//   if (!req.body.playerPicture) {
//     return res.status(500).send({ err: "playerPicture can not be empty" });
//   }

//   if (!req.body.playerScore) {
//     return res.status(500).send({ err: "playerScore can not be empty" });
//   }

//   if (!req.body.installationLocation) {
//     return res
//       .status(500)
//       .send({ err: "installationLocation can not be empty" });
//   }

//   const score = new Score({
//     playerName: req.body.playerName,
//     playerRegion: req.body.playerRegion,
//     playerPicture: req.body.playerPicture,
//     playerScore: req.body.playerScore,
//     installationLocation: req.body.installationLocation
//   });

//   score
//     .save()
//     .then(score => res.send(score))
//     .catch(err => {
//       res.status(500).send({ error: err.score || "Error" });
//     });
// };

exports.findAll = async (req, res) => {
  try {
    const regioscores = await Regioscore.find();
    res.send(regioscores);
  } catch (err) {
    res.status(500).send({ err: err.regioscore || "Error" });
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

exports.update = async (req, res) => {
  if (!req.body.score) {
    return res.status(400).send("score mag niet leeg zijn");
  }

  // if (!req.body.regio) {
  //   return res.status(400).send("regio mag niet leeg zijn");
  // }

  try {
    const regioscore = await Regioscore.findOneAndUpdate(
      {
        _id: req.params.regioName
      },
      {
        score: req.body.score,
        regio: req.body.regio
      },
      {
        new: true
      }
    );

    if (!regioscore) {
      return res.status(404).send("No regioscore found");
    }
    res.send(regioscore);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(417).send("Geen geldig ID");
    }
    return res.status(500).send(err);
  }
};

// exports.delete = async (req, res) => {
//   try {
//     const score = await Score.findOneAndRemove({
//       _id: req.params.scoreId
//     });
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
