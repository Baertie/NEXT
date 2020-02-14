module.exports = app => {
  const controller = require("../controllers/scores.controller.js");
  app.post("/api/scores", controller.create);
  app.get("/api/scores", controller.findAll);
  app.get("/api/scores/:limit", controller.getLimited);
  app.delete("/api/scores/:scoreId", controller.delete);
};
