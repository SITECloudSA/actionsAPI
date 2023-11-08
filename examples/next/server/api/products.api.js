const { apiRoute, QUERY } = require("actionsapi");
const cont = require("../controller");

const routes = apiRoute();

routes.get("/", cont.getAllProducts);
routes.get("/name", cont.getProduct, { name: QUERY });

module.exports = routes;
