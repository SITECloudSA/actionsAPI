<<<<<<< HEAD
const { apiRouter, PARAM } = require("actionsAPI");
=======
const { apiRouter, PARAM } = require("../../index");
>>>>>>> 5f636922230ca29378c0001b0035768c0df2059c
const cont = require("../controller");

const app = apiRouter();

app.get("/", cont.getAllUsers);
app.get("/{name}", cont.getUser, { name: PARAM });

module.exports = app;
