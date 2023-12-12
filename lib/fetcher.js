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
 * @type {import('./type').SetSdkConfig
 */
export const setConfig = (globalconfig) => {
  Object.keys(globalconfig).forEach((key) => (config[key] = globalconfig[key]));
};

export default async (action, method, path, input, body) => {
  const { onStart, onComplete, onFail, onSuccess, useSockets, authorization, contentType, headers, ...rest } = config;
  onStart && (await onStart({ action, method, path, input, body, config }));
  return new Promise((resolve, reject) =>
    fetch(`${config.baseUrl}${path}`, { method, body, headers: { Authorization: authorization, "Content-Type": contentType, ...headers }, ...rest })
      .then((response) => {
        const data = response.json();
        onSuccess && onSuccess({ data, response, action, method, path, input, body });
        onComplete && onComplete({ data, response, action, method, path, input, body });
        resolve(data);
      })
      .catch(async (error) => {
        onFail && (await onFail({ error, action, method, path, input, body }));
        onComplete && (await onComplete({ error, action, method, path, input, body }));
        reject(error);
      })
  );
};
