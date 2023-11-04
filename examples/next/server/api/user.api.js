const { apiRoutes, PARAM, BODY } = require("actionsapi");
const cont = require("../controller");

const routes = apiRoutes();

routes.get("/", cont.getAllUsers);
routes.get("/{name}", cont.getUser, { name: PARAM });
routes.post("/", cont.addUser, { name: BODY, age: BODY });

module.exports = routes;
