const { apiRouter, QUERY } = require("../../index");
const cont = require("../controller");

const app = apiRouter();

app.get("/", cont.getAllProducts);
app.get("/name", cont.getProduct, { name: QUERY });

module.exports = app;
