const express = require("express");
const apiRouter = express();
const { compareApis, findRoute } = require("./utils");
const generateDocs = require("./generateDocs");
const generateSDK = require("./generateSDK");

let errorHandler = ({ error, res }) => {
  console.log(error);
  res.status(500).json({ error: "Unhandled Error Occoured" });
};
let notFoundMessage = { message: "notfound" };
let preAcrions = [];
let postActions = [];
let files = {};

apiRouter.use(express.json());
apiRouter.SetErrorHandler = (func) => (errorHandler = func);
apiRouter.SetNotFound = (obj) => (notFoundMessage = obj);
apiRouter.PreAction = (func) => preAcrions.push(func);
apiRouter.PostAction = (func) => postActions.push(func);
apiRouter.generateDocs = (configs) => generateDocs({ files, ...configs });
apiRouter.generateSDK = generateSDK;
apiRouter.OrginalUse = apiRouter.use;
apiRouter.use = (...arr) => {
  arr[1].ApiRouter && (files[arr[0]] = arr[1]);
  return apiRouter.OrginalUse(...arr);
};

class ApiRouter {
  constructor() {
    this.routes = [];
    this.preActions = [];
    this.postActions = [];
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

  addPreAction(action) {
    this.preActions.push(action);
  }

  addPostAction(action) {
    this.postActions.push(action);
  }
}

module.exports.apiRouter = apiRouter;
module.exports.apiRoutes = () => {
  const router = new ApiRouter();

  async function handler(req, res) {
    const route = router.getRoute(req);
    const { action, input: inputSchema, path } = route;

    if (route) {
      let rawinput = { ...req.params, ...req.query, ...req.body };
      // clean the input and only allow the ones ine the API defionion
      let input = {};
      let result;
      Object.keys(inputSchema || {}).forEach((k) => (input[k] = rawinput[k]));
      try {
        for (const preAction of preAcrions.concat(router.preActions)) {
          input = await preAction({ input, action, route, req, res, context: this });
        }
        result = await action(input);
        for (const postAction of postActions.concat(router.postActions)) {
          result = await postAction({ input, action, route, req, res, result, context: this });
        }
        result ? res.status(200).json(result) : res.status(200).send();
      } catch (error) {
        errorHandler({ error, input, action, route, req, res, result, context: this });
      }
    } else {
      res.status(404).json(notFoundMessage);
    }
  }
  handler.get = (path, action, input) => router.addRoute({ method: "GET", path, action, input });
  handler.post = (path, action, input) => router.addRoute({ method: "POST", path, action, input });
  handler.put = (path, action, input) => router.addRoute({ method: "PUT", path, action, input });
  handler.delete = (path, action, input) => router.addRoute({ method: "DELETE", path, action, input });
  handler.PreAction = (func) => router.addPreAction(func);
  handler.PostAction = (func) => router.addPostAction(func);
  handler.getRoutes = () => router.getRoutes();
  handler.ApiRouter = router;
  return handler;
};
