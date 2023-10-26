// this is a typical express app

const { ApiApp } = require("actionsAPI");

ApiApp.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

ApiApp.use("/users", require("./user.api"));
ApiApp.use("/products", require("./products.api"));
ApiApp.use("/docs", ApiApp.generateDocs());

module.exports = ApiApp;
