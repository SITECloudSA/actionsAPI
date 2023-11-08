const express = require("express");
const apiRoutes = express();
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

apiRoutes.use(express.json());
apiRoutes.SetErrorHandler = (func) => (errorHandler = func);
apiRoutes.SetNotFound = (obj) => (notFoundMessage = obj);
apiRoutes.PreAction = (func) => preAcrions.push(func);
apiRoutes.PostAction = (func) => postActions.push(func);
apiRoutes.generateDocs = (configs) => generateDocs({ files, ...configs });
apiRoutes.generateSDK = generateSDK;
apiRoutes.OrginalUse = apiRoutes.use;
apiRoutes.use = (...arr) => {
  arr[1].ApiRouter && (files[arr[0]] = arr[1]);
  return apiRoutes.OrginalUse(...arr);
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

module.exports.apiRoutes = apiRoutes;
module.exports.apiRoute = () => {
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
        for (const preAction of preAcrions.concat(route.preAcrions)) {
          input = await preAction({ input, action, route, req, res, context: this });
        }
        result = await action(input);
        for (const postAction of postActions.concat(route.postActions)) {
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
