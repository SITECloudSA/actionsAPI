const { apiRouter, PARAM } = require("../../index");
const cont = require("../controller");

const app = apiRouter();

app.get("/", cont.getAllUsers);
app.get("/{name}", cont.getUser, { name: PARAM });

module.exports = app;
