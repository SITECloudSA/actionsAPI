const express = require("express");
const { compareApis, findRoute } = require("./utils");
const generateDocs = require("./generateDocs");
const generateSDK = require("./generateSDK");
const WebSocket = require("ws");

let errorHandler = ({ error, res }) => {
  console.log(error);
  res.status(500).json({ error: "Unhandled Error Occoured" });
};
let notFoundMessage = { message: "notfound" };
let preAcrions = [];
let postActions = [];
let files = {};

module.exports.apiApp = (dir) => {
  const apiApp = express();

  let docsGenerated = false;
  apiApp.prefix = "";
  // apiApp.use(express.json());
  apiApp.SetErrorHandler = (func) => (errorHandler = func);
  apiApp.notFoundRequest = (_, res) => res.status(404).json(notFoundMessage);
  apiApp.SetNotFound = (obj) => (notFoundMessage = obj);
  apiApp.PreAction = (func) => preAcrions.push(func);
  apiApp.PostAction = (func) => postActions.push(func);
  apiApp.generateDocs = (configs) => {
    apiApp.use("/docs", generateDocs({ files, ...configs }));
  };
  apiApp.generateSDK = (config = {}) => {
    docsGenerated = { apiFiles: files, prefix: apiApp.prefix, ...config };
    generateSDK(docsGenerated);
  };
  apiApp.get("/static", function (req, res) {
    res.sendFile(dir + "/index.html");
  });

  apiApp.OriginalListen = apiApp.listen;
  apiApp.OrginalUse = apiApp.use;
  apiApp.listen = (...arr) => {
    docsGenerated && generateSDK({ ...docsGenerated, useSocket: true });
    const websocketServer = new WebSocket.Server({ noServer: true });
    websocketServer.on("connection", function connection(websocketConnection, connectionRequest) {
      websocketConnection.on("message", socketHandler);
    });
    let server = apiApp.OriginalListen(...arr);
    server.on("upgrade", (request, socket, head) => {
      console.log("upgrading...");
      websocketServer.handleUpgrade(request, socket, head, (websocket) => {
        websocketServer.emit("connection", websocket, request);
      });
    });
    return server;
  };
  apiApp.use = (...arr) => {
    if (arr[1].apiRoutes) {
      files[arr[0]] = arr[1];
    } else {
      apiApp.prefix = arr[0] + apiApp.prefix;
    }
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
  // TODO: remove either one of the two
  handler.getRoutes = () => routes;
  handler.apiRoutes = routes;
  return handler;
};

const socketHandler = (message) => {
  console.log({ message });
};
