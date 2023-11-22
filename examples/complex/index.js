const { apiApp } = require("actionapi");
const app = require("./api");

const port = 3001;

apiApp.use("/api", app);

apiApp.use("*", apiApp.notFoundRequest);

apiApp.listen(port, () => console.log(`Example app listening on port ${port}`));
