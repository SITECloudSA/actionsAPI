const express = require("express");
const { compareApis, findRoute } = require("./utils");
const generateDocs = require("./generateDocs");
const generateSDK = require("./generateSDK");
const { socketHandler, actionHandler, postActions, preActions } = require("./handler");
const socketio = require("socket.io");

let errorHandler = ({ error, res }) => {
  console.log(error);
  res.status(500).json({ error: "Unhandled Error Occoured" });
};
let notFoundMessage = { message: "notfound" };
let files = {};

module.exports.apiApp = () => {
  const apiApp = express();
  apiApp.prefix = "";
  apiApp.use(express.json());

  apiApp.SetErrorHandler = (func) => (errorHandler = func);
  apiApp.notFoundRequest = (_, res) => res.status(404).json(notFoundMessage);
  apiApp.SetNotFound = (obj) => (notFoundMessage = obj);
  apiApp.PreAction = (func) => preActions.push(func);
  apiApp.PostAction = (func) => postActions.push(func);

  // TODO: add validation to check that sdk, docs are lat called
  apiApp.generateDocs = ({ path = "/docs", ...configs } = {}) => apiApp.OrginalUse(`${apiApp.prefix}${path}`, generateDocs({ files, path, ...configs }));
  apiApp.generateSDK = ({ path = "/ws", disableSocket, ...config } = {}) => {
    !disableSocket && apiApp.OrginalUse(`${apiApp.prefix}${path}`, socketHandler({ path: `${apiApp.prefix}${path}`, files }));
    generateSDK({ files, prefix: apiApp.prefix, disableSocket, socketPath: path, ...config });
  };

  apiApp.OrginalUse = apiApp.use;
  apiApp.use = (...arr) => {
    if (arr[1]?.apiRoutes) {
      files[arr[0]] = arr[1];
    } else {
      apiApp.prefix = arr[0] + apiApp.prefix;
    }
    return apiApp.OrginalUse(...arr);
  };
  return apiApp;
};
module.exports.apiApp.express = express;
module.exports.apiApp.socketio = socketio;
module.exports.apiRoutes = () => {
  const routes = [];

  const addRoute = (route) => {
    routes.push(route);
    routes.sort((a, b) => compareApis(a.path, b.path));
  };

  async function handler(req, res) {
    const route = findRoute(routes, req);

    route && actionHandler({ req, res, route, onSucces: ({ result }) => (result ? res.status(200).json(result) : res.status(200).send()), onError: (args) => errorHandler(args) });
  }
  handler.get = (path, action, input) => addRoute({ method: "GET", path, action, input });
  handler.post = (path, action, input) => addRoute({ method: "POST", path, action, input });
  handler.put = (path, action, input) => addRoute({ method: "PUT", path, action, input });
  handler.delete = (path, action, input) => addRoute({ method: "DELETE", path, action, input });
  // TODO: remove either one of the two
  handler.getRoutes = () => routes;
  handler.apiRoutes = routes;
  return handler;
};
