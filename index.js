module.exports = require("express");
module.exports.apiRouter = require("./lib/router").apiRouter;
module.exports.apiRouterSetErrorHandler = require("./lib/router").apiRouterSetErrorHandler;
module.exports.apiRouterSetNotFound = require("./lib/router").apiRouterSetNotFound;
module.exports.PARAM = "PARAM";
module.exports.QUERY = "QUERY";
module.exports.BODY = "BODY";
