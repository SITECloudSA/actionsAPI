const { Server } = require("socket.io");

module.exports.preActions = [];
module.exports.postActions = [];

module.exports.socketHandler = ({ path, files }) => {
  const routes = Object.keys(files).reduce((prev, file) => {
    prev.push(...files[file].getRoutes());
    return prev;
  }, []);

  return (req, res) => {
    console.log("init...", path);
    if (res.socket.server.actionsApiWS) {
      res.end();
      return;
    }
    const io = new Server(res.socket.server, { path });
    io.on("connection", (socket) => {
      console.log("connecting..");
      socket.on("action", ({ action, input = {}, headers = {} }) => {
        req.headers = headers;
        req.input = input;
        const route = routes.find((route) => route.action.name === action);
        console.log("actioning...", route);

        route &&
          this.actionHandler({
            req,
            res,
            isSocket: true,
            route,
            onSucces: ({ result }) => {
              console.log("successing...", action);
              socket.emit(`${action}`, { data: result });
            },
            onError: ({ error }) => {
              socket.emit(`${action}`, { error });
            },
          });
      });
    });
    res.socket.server.actionsApiWS = io;
    res.end();
  };
};

module.exports.actionHandler = async ({ req, res, isSocket, route, onSucces, onError, context }) => {
  if (route) {
    const { action, input: inputSchema } = route;
    let rawinput = { ...req.params, ...req.query, ...req.body, ...req.input };
    // clean the input and only allow the ones ine the API defionion
    let input = {};
    let result;
    Object.keys(inputSchema || {}).forEach((k) => (input[k] = rawinput[k]));
    try {
      for (const preAction of this.preActions) {
        input = await preAction({ input, action, route, req, res, context, isSocket });
      }
      result = await action(input);
      for (const postAction of this.postActions) {
        result = await postAction({ input, action, route, req, res, result, context, isSocket });
      }
      onSucces({ result, input, action, route, req, res, result, context, isSocket });
    } catch (error) {
      onError({ error, input, action, route, req, res, result, context, isSocket });
    }
  }
};
