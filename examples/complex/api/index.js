// this is a typical express app
const { apiApp } = require("actionapi");
const app = apiApp();
app.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

app.use("/users", require("./user.api"));
app.use("/products", require("./products.api"));
app.generateDocs();

module.exports = app;
