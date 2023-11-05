const { ApiApp } = require("actionsapi");
const express = require("actionsapi");

ApiApp.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

ApiApp.use("/users", require("./user.api"));
ApiApp.use("/products", require("./products.api"));
ApiApp.use("/docs", ApiApp.generateDocs());

const app = express();
app.use("/api", ApiApp);
module.exports = app;
