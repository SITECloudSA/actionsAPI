const express = require("../index");
const api = require("./api");

const app = express();
const port = 3000;

app.use("/api", api);

app.get("*", (req, res) => res.status(404).json("Page not found"));

app.listen(port, () => console.log(`Example app listening on port ${port}`));
