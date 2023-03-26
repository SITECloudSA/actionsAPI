const express = require("actionsAPI");

const { ApiRouter } = require("actionsAPI");
const { apiFiles, apiApp } = require("./api");

const app = express();
const port = 3000;

ApiRouter.PreAction(({ action, input, route, req, res }) => {
  console.log(`You are about to excute an action called`, action.name);
  return input;
});

app.use("/api", apiApp);

app.get("*", (req, res) => res.status(404).json("Page not found"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));

ApiRouter.generateSwaggerApp({ root: "/api", apiFiles });
// ApiRouter.generateDocs(...)
// ApiRouter.generateSDK(...)
