const p = require("path");

generateDocs = (configs) => {
  const { root, apiFiles, path = process.cwd(), swaggerFile = "swagger-config.json", swaggerFolder = "swagger" } = configs;
  console.log("your docs will be genereted in", p.resolve(path, swaggerFolder));
  console.log("your docs data is:", root, Object.keys(apiFiles));
};

generateSwaggerApp = (configs) => {
  // Copy files from templates here
  // TODO
  return generateDocs(configs);
};

module.exports = { generateSwaggerApp, generateDocs };
