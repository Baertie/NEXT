module.exports = app => {
  const controller = require("../controllers/regioscores.controller.js");
  //   app.post("/api/scores", controller.create);
  app.get("/api/regioscores", controller.findAll);

  //   app.get("/api/core/:answerId", controller.findOne);
  app.put("/api/regioscores/:regioName", controller.update);
  //   app.delete("/api/scores/:scoreId", controller.delete);
};
