const { apiApp, apiRoutes } = require("actionapi");

const routes = apiRoutes();
const app = apiApp();
const testAction = () => ({ test: "alll" });
routes.get("/test", testAction);

app.generateDocs();
app.generateSDK();
app.use("/api", routes);

app.use(apiApp.express.static("static"));

app.use("*", app.notFoundRequest);
app.listen(3000);
