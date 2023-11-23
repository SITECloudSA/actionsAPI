const { apiApp, apiRoutes } = require("actionapi");

const routes = apiRoutes();
const app = apiApp();
const testAction = () => ({ test: "alll" });
routes.get("/test", testAction);

app.use("/docs", app.generateDocs());
app.use("/api", routes);

app.use("*", app.notFoundRequest);
app.listen(3000);
