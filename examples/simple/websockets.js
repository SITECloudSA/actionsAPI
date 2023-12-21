const WebSocket = require("ws");

module.exports = (expressServer, path) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: path || "/ws",
  });
  console.log("init sockets");
  expressServer.on("upgrade", (request, socket, head) => {
    console.log("upgrading...");
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit("connection", websocket, request);
    });
  });

  websocketServer.on("connection", function connection(websocketConnection, connectionRequest) {
    const [_path, params] = connectionRequest?.url?.split("?");
    const connectionParams = queryString.parse(params);

    // NOTE: connectParams are not used here but good to understand how to get
    // to them if you need to pass data with the connection to identify it (e.g., a userId).
    console.log("connnnecct", connectionParams);

    websocketConnection.on("message", (message) => {
      const parsedMessage = JSON.parse(message);
      console.log({ parsedMessage });
      websocketConnection.send(JSON.stringify({ message: "There be gold in them thar hills." }));
    });
  });

  return websocketServer;
};
