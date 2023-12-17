const { apiApp } = require("actionapi");

const apiRouter = apiApp();
const app = apiApp();

apiRouter.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

apiRouter.use("/users", require("./user.api"));
apiRouter.use("/products", require("./products.api"));
apiRouter.use("/docs", apiRouter.generateDocs());

app.use("/api", apiRouter);

app.generateSDK();
app.use("*", app.notFoundRequest);

module.exports = app;
