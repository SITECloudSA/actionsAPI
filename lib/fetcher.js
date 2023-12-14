/**
 * @type {import('./type').SdkConfig
 */
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
  interval: 5000,
};

/**
 * @type {import('./type').SetSdkConfig
 */
export const setConfig = (globalconfig) => {
  Object.keys(globalconfig).forEach((key) => (config[key] = globalconfig[key]));
};

export default async (action, method, path, input, body, isHook) => {
  const { onStart, onComplete, onFail, onSuccess, useSockets, authorization, contentType, headers, ...rest } = config;
  onStart && (await onStart({ action, method, path, input, body, isHook, config }));
  return new Promise((resolve, reject) =>
    fetch(`${config.baseUrl}${path}`, { method, body, headers: { Authorization: authorization, "Content-Type": contentType, ...headers }, ...rest })
      .then(async (response) => {
        if (isHook) {
          resolve(response.text());
          return;
        }
        const data = response.json();
        onSuccess && onSuccess({ data, response, action, method, path, input, body, isHook });
        onComplete && onComplete({ data, response, action, method, path, input, body, isHook });
        resolve(data);
      })
      .catch(async (error) => {
        onFail && (await onFail({ error, action, method, path, input, body, isHook }));
        onComplete && (await onComplete({ error, action, method, path, input, body, isHook }));
        reject(error);
      })
  );
};
