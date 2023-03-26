<<<<<<< HEAD
const { apiRouter, QUERY } = require("actionsAPI");
=======
const { apiRouter, QUERY } = require("../../index");
>>>>>>> 5f636922230ca29378c0001b0035768c0df2059c
const cont = require("../controller");

const app = apiRouter();

app.get("/", cont.getAllProducts);
app.get("/name", cont.getProduct, { name: QUERY });

module.exports = app;
