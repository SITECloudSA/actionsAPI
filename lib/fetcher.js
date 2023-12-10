export const config = {
  baseUrl: "",
  onStart: undefined,
  onSuccess: undefined,
  onFail: undefined,
  onComplete: undefined,
  authorization: "",
  useSockets: false,
  headers: {},
  contentType: "Application/json",
};

/**
 * setting global configuration to SDK generator
 * @param {Object} globalconfig config
 * @param {String} globalconfig.baseUrl string
 * @param {Function} globalconfig.onSuccess funtion
 * @param {Function} globalconfig.onFail function
 * @param {Boolean} globalconfig.useSockets boolean
 */
export const setConfig = (globalconfig) => {
  Object.keys(globalconfig).forEach((key) => (config[key] = globalconfig[key]));
};

export default async (action, method, path, input, body) => {
  const { onStart, onComplete, onFail, onSuccess, useSockets, authorization, contentType, headers, ...rest } = config;
  onStart && (await onStart(action, method, path, input, body, config));
  return new Promise((resolve, reject) =>
    fetch(`${config.baseUrl}${path}`, { method, body, headers: { Authorization: authorization, "Content-Type": contentType, ...headers }, ...rest })
      .then((res) => {
        const data = res.json();
        onSuccess && onSuccess(data, res, action, method, path, input, body);
        onComplete && onComplete(data, res, action, method, path, input, body);
        resolve(data);
      })
      .catch(async (err) => {
        onFail && (await onFail(err, action, method, path, input, body));
        onComplete && (await onComplete(err, action, method, path, input, body));
        reject(err);
      })
  );
};
