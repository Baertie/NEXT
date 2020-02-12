module.exports = app => {
  const controller = require("../controllers/scores.controller.js");
  app.post("/api/scores", controller.create);
  app.get("/api/scores", controller.findAll);
  app.get("/api/scores/:limit", controller.getLimited);

  //   app.get("/api/core/:answerId", controller.findOne);
  //   app.put("/api/core/:answerId", controller.update);
  app.delete("/api/scores/:scoreId", controller.delete);
};
