const Regioscore = require("../models/regioscore.model.js");

exports.findAll = async (req, res) => {
  try {
    const regioscores = await Regioscore.find().sort({ score: -1 });
    res.send(regioscores);
  } catch (err) {
    res.status(500).send({ err: err.regioscore || "Error" });
  }
};

exports.update = async (req, res) => {
  if (!req.body.score) {
    return res.status(400).send("score mag niet leeg zijn");
  }

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
