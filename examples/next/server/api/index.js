const { apiApp } = require("actionapi");

const apiRouter = apiApp();
const app = apiApp();

apiRouter.PreAction(({ action, input, route, req, res, context }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

apiRouter.use("/users", require("./user.api"));
apiRouter.use("/products", require("./products.api"));
apiRouter.generateDocs();
apiRouter.generateSDK({ prefix: "/api" });
app.use("/api", apiRouter);

app.use("*", (req, res) => {
  console.log("ss", req.url);
  res.end();
});

module.exports = app;
