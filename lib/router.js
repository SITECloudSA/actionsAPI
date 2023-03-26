const { compareApis, findRoute } = require("./utils");
const { generateSwaggerApp, generateDocs } = require("./generateDocs");
const { generateSDK } = require("./generateSDK");

let notFoundMessage;
let preAcrions = [];
let postActions = [];
let errorHandler = ({ error, res }) => {
  console.log(error);
  res.status(500).json({ error: "Unhandled Error Occoured" });
};

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
  static SetErrorHandler(func) {
    errorHandler = func;
  }
  static SetNotFound(obj) {
    notFoundMessage = obj;
  }
  static PreAction(func) {
    preAcrions.push(func);
  }
  static PostAction(func) {
    postActions.push(func);
  }
  static generateSwaggerApp(...arr) {
    return generateSwaggerApp(...arr);
  }
  static generateDocs(...arr) {
    return generateDocs(...arr);
  }
  static generateSDK(...arr) {
    return generateSDK(...arr);
  }
}

module.exports.ApiRouter = ApiRouter;
module.exports.apiRouter = () => {
  const router = new ApiRouter();

  const handler = async (req, res) => {
    const route = router.getRoute(req);
    const { action, input: inputSchema, path } = route;

    if (route) {
      let rawinput = { ...req.params, ...req.query, ...req.body };
      // clean the input and only allow the ones ine the API defionion
      let input = {};
      let result;
      Object.keys(inputSchema || {}).forEach((k) => (input[k] = rawinput[k]));
      try {
        for (const preAction of preAcrions) {
          input = await preAction({ input, action, route, req, res });
        }
        result = await action(input);
        for (const postAction of postActions) {
          result = await postAction({ input, action, route, req, res, result });
        }
        result ? res.status(200).json(result) : res.status(200).send();
      } catch (error) {
        errorHandler({ error, input, action, route, req, res, result });
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
