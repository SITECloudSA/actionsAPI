const { Server } = require("socket.io");

module.exports = ({ path, prefix }) => {
  return (req, res) => {
    console.log("init...", `${prefix}${path}`);
    if (res.socket.server.actionsApiWS) {
      res.end();
      return;
    }
    const io = new Server(res.socket.server, { path: `${prefix}${path}` });
    io.on("connection", (client) => {
      console.log("connecting..");
      client.on("event", (data) => {
        /* … */
        console.log("event");
      });
    });
    res.socket.server.actionsApiWS = io;
    res.end();
  };
};
