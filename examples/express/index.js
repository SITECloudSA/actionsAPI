const { apiApp } = require("actionsapi");
const ApiApp = require("./api");

const port = 3001;

apiApp.use("/api", ApiApp);

apiApp.get("*", (req, res) => res.status(404).json("Page not found"));

apiApp.listen(port, () => console.log(`Example app listening on port ${port}`));
