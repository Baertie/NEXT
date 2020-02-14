module.exports = app => {
  const controller = require("../controllers/regioscores.controller.js");
  app.get("/api/regioscores", controller.findAll);
  app.put("/api/regioscores/:regioName", controller.update);
};
