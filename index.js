module.exports = require("express");
module.exports.apiRoutes = require("./lib/router").apiRoutes;
module.exports.ApiApp = require("./lib/router").ApiApp;
module.exports.PARAM = "PARAM";
module.exports.QUERY = "QUERY";
module.exports.BODY = "BODY";
