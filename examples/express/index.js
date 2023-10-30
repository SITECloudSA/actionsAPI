const express = require("actionsAPI");
const app = express();
const ApiApp = require("./api");

const port = 3001;

app.use("/api", ApiApp);

app.get("*", (req, res) => res.status(404).json("Page not found"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
