const { apiRoutes } = require("actionsapi");
const { apiApp } = require("actionsapi");

apiRoutes.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

apiRoutes.use("/users", require("./user.api"));
apiRoutes.use("/products", require("./products.api"));
apiRoutes.use("/docs", apiRoutes.generateDocs());

const app = apiApp();
app.use("/api", apiRoutes);
module.exports = app;
