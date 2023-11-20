const { apiRouter, apiApp } = require("actionsapi");

apiRouter.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

apiRouter.use("/users", require("./user.api"));
apiRouter.use("/products", require("./products.api"));
apiRouter.use("/docs", apiRouter.generateDocs());

apiApp.use("/api", apiRouter);
module.exports = apiApp;
