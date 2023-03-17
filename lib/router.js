const { compareApis, findRoute } = require("./utils");

class ApiRouter {
  constructor() {
    this.routes = [];
  }
  addRoute(route) {
    this.routes.push(route);
    this.routes.sort((a, b) => compareApis(a.path, b.path));
  }
  getRoute(req) {
    return findRoute(this.routes, req);
  }
  getRoutes() {
    return this.routes;
  }
}

let notFoundMessage;
let errorHandler;
module.exports.apiRouterSetErrorHandler = (func) => (notFoundMessage = func);
module.exports.apiRouterSetNotFound = (obj) => (notFoundMessage = obj);
module.exports.apiRouter = () => {
  const router = new ApiRouter();

  const handler = async (req, res) => {
    const route = router.getRoute(req);

    if (route) {
      let rawinput = { ...req.params, ...req.query, ...req.body };
      // clean the input and only allow the ones ine the API defionion
      let input = {};
      Object.keys(route.input || {}).forEach((k) => (input[k] = rawinput[k]));
      try {
        let result;
        result = await route.action(input);
        result ? res.status(200).json(result) : res.status(200).send();
      } catch (e) {
        errorHandler ? errorHandler(e, req, res) : console.log(e);
      }
    } else {
      res.status(404).json(notFoundMessage || { message: "notfound" });
    }
  };
  handler.get = (path, action, input) => router.addRoute({ method: "GET", path, action, input });
  handler.post = (path, action, input) => router.addRoute({ method: "POST", path, action, input });
  handler.put = (path, action, input) => router.addRoute({ method: "PUT", path, action, input });
  handler.delete = (path, action, input) => router.addRoute({ method: "DELETE", path, action, input });
  handler.getRoutes = router.getRoutes;
  handler.apiRouter = router;
  return handler;
};
