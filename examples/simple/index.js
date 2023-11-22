const { apiApp, apiRoutes } = require("actionapi");

const routes = apiRoutes();
const testAction = () => ({ test: "alll" });
routes.get("/test", testAction);

apiApp.use("/docs", apiApp.generateDocs());
apiApp.use("/api", routes);

apiApp.use("*", apiApp.notFoundRequest);
apiApp.listen(3000);
