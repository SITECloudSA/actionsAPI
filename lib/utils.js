const compareApis = (apiOne, apiTwo) => {
  // one > two return 1
  // one < two return -1
  // one = two return 0
  const SEPERATOR = "{";
  const apiOneSegments = apiOne.split("/");
  const apiTwoSegments = apiTwo.split("/");
  if (apiOneSegments.length !== apiTwoSegments.length) return apiOneSegments.length - apiTwoSegments.length;

  const shortest = apiOneSegments.length > apiTwoSegments.length ? apiOneSegments : apiTwoSegments;

  for (let i = 1; i < shortest.length; i++) {
    const segmentOne = apiOneSegments[i];
    const segmentTwo = apiTwoSegments[i];
    const isOneParam = segmentOne.indexOf(SEPERATOR) >= 0;
    const isTwoParam = segmentTwo.indexOf(SEPERATOR) >= 0;
    if (!isOneParam && !isTwoParam) {
      if (segmentOne === segmentTwo) continue;
      else return segmentOne.localeCompare(segmentTwo);
    } else {
      if (isOneParam && isTwoParam) continue;
      if (isOneParam && !isTwoParam) return 1;
      if (!isOneParam && isTwoParam) return -1;
    }
  }
  return 0;
};

const findRoute = (routes, req) => {
  const path = req.path;
  const method = req.method;
  const reqApi = path.replace(/\/$/, "").split("/");
  let pathParams;
  const result = routes.find((srcRoute) => {
    pathParams = {};
    // regex below is to remove trailin / in the path
    const srcApi = srcRoute.path.replace(/\/$/, "").split("/");

    if (srcRoute.method !== method || reqApi.length !== srcApi.length) return false;
    for (let i = 0; i < reqApi.length; i++) {
      // regex below is to select the variable-key between curly brackets
      const paramKey = /[^{}]+(?=})/.exec(srcApi[i]);
      if (!paramKey) {
        if (srcApi[i] !== reqApi[i]) return false;
      } else {
        pathParams[paramKey[0]] = reqApi[i];
      }
    }
    return true;
  });
  if (result) req.params = pathParams;
  return result;
};

module.exports = { compareApis, findRoute };
