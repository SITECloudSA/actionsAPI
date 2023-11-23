const express = require("express");
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

module.exports.apiApp = () => {
  const apiApp = express();

  apiApp.use(express.json());
  apiApp.SetErrorHandler = (func) => (errorHandler = func);
  apiApp.notFoundRequest = (_, res) => res.status(404).json(notFoundMessage);
  apiApp.SetNotFound = (obj) => (notFoundMessage = obj);
  apiApp.PreAction = (func) => preAcrions.push(func);
  apiApp.PostAction = (func) => postActions.push(func);
  apiApp.generateDocs = (configs) => generateDocs({ files, ...configs });
  apiApp.generateSDK = generateSDK;

  apiApp.OrginalUse = apiApp.use;
  apiApp.use = (...arr) => {
    arr[1].apiRoutes && (files[arr[0]] = arr[1]);
    return apiApp.OrginalUse(...arr);
  };
  return apiApp;
};
module.exports.apiRoutes = () => {
  const routes = [];

  const addRoute = (route) => {
    routes.push(route);
    routes.sort((a, b) => compareApis(a.path, b.path));
  };

  async function handler(req, res) {
    const route = findRoute(routes, req);

    if (route) {
      const { action, input: inputSchema, path } = route;
      let rawinput = { ...req.params, ...req.query, ...req.body };
      // clean the input and only allow the ones ine the API defionion
      let input = {};
      let result;
      Object.keys(inputSchema || {}).forEach((k) => (input[k] = rawinput[k]));
      try {
        for (const preAction of preAcrions) {
          input = await preAction({ input, action, route, req, res, context: this });
        }
        result = await action(input);
        for (const postAction of postActions) {
          result = await postAction({ input, action, route, req, res, result, context: this });
        }
        result ? res.status(200).json(result) : res.status(200).send();
      } catch (error) {
        errorHandler({ error, input, action, route, req, res, result, context: this });
      }
    }
  }
  handler.get = (path, action, input) => addRoute({ method: "GET", path, action, input });
  handler.post = (path, action, input) => addRoute({ method: "POST", path, action, input });
  handler.put = (path, action, input) => addRoute({ method: "PUT", path, action, input });
  handler.delete = (path, action, input) => addRoute({ method: "DELETE", path, action, input });
  handler.getRoutes = () => routes;
  handler.apiRoutes = routes;
  return handler;
};
