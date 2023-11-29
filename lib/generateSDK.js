module.exports = (configs) => {
  const { root, apiFiles, path = process.cwd(), sdkFile = "sdk.gen.js" } = configs;

  Object.keys(apiFiles)
    .sort()
    .forEach((prefix) =>
      apiFiles[prefix]
        .getRoutes()
        .sort((a, b) => (a.action < b.action ? -1 : 1))
        .forEach((route) => console.log({ route }))
    );
};
