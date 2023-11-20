const apiApp = require("express");

module.exports.apiApp = apiApp();
module.exports.apiRoutes = require("./lib/router").apiRoutes;
module.exports.apiRouter = require("./lib/router").apiRouter;
module.exports.PARAM = "PARAM";
module.exports.QUERY = "QUERY";
module.exports.BODY = "BODY";
