const { apiRoutes, QUERY } = require("actionapi");
const cont = require("../controller");

const routes = apiRoutes();

routes.get("/", cont.getAllProducts);
routes.get("/name", cont.getProduct, { name: QUERY });

module.exports = routes;
