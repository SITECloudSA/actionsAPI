module.exports = require("express");
module.exports.apiRouter = require("./lib/router").apiRouter;
<<<<<<< HEAD
module.exports.ApiRouter = require("./lib/router").ApiRouter;
=======
module.exports.apiRouterSetErrorHandler = require("./lib/router").apiRouterSetErrorHandler;
module.exports.apiRouterSetNotFound = require("./lib/router").apiRouterSetNotFound;
>>>>>>> 5f636922230ca29378c0001b0035768c0df2059c
module.exports.PARAM = "PARAM";
module.exports.QUERY = "QUERY";
module.exports.BODY = "BODY";
