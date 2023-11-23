const { apiApp } = require("actionapi");
const appRouter = require("./api");

const app = apiApp();

const port = 3001;

app.use("/api", appRouter);

app.use("*", app.notFoundRequest);

app.listen(port, () => console.log(`Example app listening on port ${port}`));
