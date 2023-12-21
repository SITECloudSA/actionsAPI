const { apiApp, apiRoutes } = require("actionapi");
const routes = apiRoutes();
const app = apiApp(__dirname);
const testAction = () => ({ test: "alll" });
routes.get("/test", testAction);

app.use("/api", routes);

app.generateDocs();
app.generateSDK();

app.use("*", app.notFoundRequest);
app.listen(3000);
// const { createServer } = require("http");
// const fs = require("fs");
// const { parse } = require("url");
// const { WebSocketServer } = require("ws");

// const server = createServer((req, res) => {
//   const html = fs.readFileSync("./index.html");
//   res.writeHeader(200, { "Content-type": "text/html" });
//   res.write(html);
//   res.end();
// });
// const wss1 = new WebSocketServer({ noServer: true });

// wss1.on("connection", function connection(ws) {
//   ws.on("error", console.error);

//   // ...
// });

// server.on("upgrade", function upgrade(request, socket, head) {
//   const { pathname } = parse(request.url);
//   console.log("upgrading...");
//   if (pathname === "/foo") {
//     wss1.handleUpgrade(request, socket, head, function done(ws) {
//       wss1.emit("connection", ws, request);
//     });
//   } else {
//     socket.destroy();
//   }
// });

// server.listen(3001);
