const { Server } = require("socket.io");
const { findRoute } = require("./utils");

module.exports.preActions = [];
module.exports.postActions = [];

module.exports.errorhandler = ({ error, sendError }) => sendError(500, error);
module.exports.resultHandler = ({ result, sendResult }) => sendResult(200, result);

module.exports.httpHandler = (req, res, routes) => {
  const route = findRoute(routes, req);
  route && this.actionHandler({ req, res, route });
};

module.exports.socketHandler = ({ path, files }) => {
  const routes = Object.keys(files).reduce((prev, file) => {
    prev.push(...files[file].getRoutes());
    return prev;
  }, []);
  console.log("socket");
  return (req, res) => {
    console.log("init...", path);
    if (res.socket.server.actionsApiWS) {
      res.end();
      return;
    }
    const io = new Server(res.socket.server, { path });
    io.on("connection", (socket) => {
      console.log("connecting..");
      socket.on("action", ({ action, input, headers }, socketCb) => {
        req.headers = headers;
        req.input = input;
        const route = routes.find((route) => route.action.name === action);
        console.log("actioning...", route);

        route &&
          this.actionHandler({
            req,
            res,
            socket,
            route,
            socketCb,
          });
      });
    });
    res.socket.server.actionsApiWS = io;
    res.end();
  };
};

module.exports.actionHandler = async function ({ req, res, socket, route, socketCb }) {
  const sendResult = (statusCode, data) => (socket ? socketCb({ data, statusCode }) : data ? res.status(statusCode).json(data) : res.status(statusCode).send());
  const sendError = (statusCode, error) => (socket ? socketCb({ error, statusCode }) : error ? res.status(statusCode).json(error) : res.status(statusCode).send());
  if (route) {
    const { action, input: inputSchema } = route;
    let rawinput = { ...req.params, ...req.query, ...req.body, ...req.input };
    // clean the input and only allow the ones ine the API defionion
    let input = {};
    let result;
    Object.keys(inputSchema || {}).forEach((k) => (input[k] = rawinput[k]));
    try {
      for (const preAction of this.preActions) {
        input = await preAction({ input, action, route, context: this, req, res, socket });
      }
      result = await action(input);
      for (const postAction of this.postActions) {
        result = await postAction({ input, action, route, result, context: this, req, res, socket });
      }
      this.resultHandler({ result, input, action, route, result, context: this, req, res, socket, sendResult });
    } catch (error) {
      this.errorhandler({ error, input, action, route, result, context: this, req, res, socket, sendError });
    }
  }
};
