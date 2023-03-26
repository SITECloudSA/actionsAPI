console.log("loader override is working");

var Module = require("module");
var path = require("path");
var originalRequire = Module.prototype.require;

Module.prototype.require = function () {
  if (arguments[0].toLowerCase() === "actionsapi") {
    arguments[0] = path.resolve(__dirname, "../", "index.js");
  }
  //do your thing here
  return originalRequire.apply(this, arguments);
};
