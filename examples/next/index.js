const next = require("next");
const actionApi = require("../../index");
const ApiApp = require("./server/api");

const app = next({ dev: true });
const port = 3001;
app.prepare().then(() => {
  const actionApiServer = actionApi();

  actionApiServer.use("/api", ApiApp);

  actionApiServer.get("*", (req, res) => res.status(404).json("Page not found"));

  actionApiServer.listen(port, () => console.log(`Example NEXT app listening on port ${port}`));
});
