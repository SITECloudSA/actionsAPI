import { io } from "socket.io-client";

let socket;

/**
 * @type {import('../type').SdkConfig
 */
export const config = {
  baseUrl: "",
  socketPath: "",
  onStart: undefined,
  onSuccess: undefined,
  onFail: undefined,
  onComplete: undefined,
  authorization: "",
  disableSocket: false,
  headers: {},
  contentType: "Application/json",
  interval: 5000,
};

/**
 * @type {import('../type').SetSdkConfig
 */
export const setConfig = (globalconfig) => {
  Object.keys(globalconfig).forEach((key) => (config[key] = globalconfig[key]));
  socket && socket.disconnect();
  console.log(`client connecting... ${config.baseUrl}${config.socketPath}`);
  !globalconfig.disableSocket && (socket = io({ path: `${config.baseUrl}${config.socketPath}`, transports: ["websocket"], upgrade: false }));
  !globalconfig.disableSocket &&
    (socket.request = (data = {}) =>
      new Promise((resolve) => {
        console.log("resolving", data);
        socket.emit("action", data, resolve);
      }));

  globalconfig.disableSocket && (socket = undefined);
};

/**
 * @param {String} action
 * @param {String} path
 * @param {Object} data
 * @returns {Promise}
 */
const sdkFetch = (action, path, data) => {
  console.log({ socket });
  return socket ? socket.request({ action, ...data }) : fetch(path, data);
};

export default async (action, method, path, input, body, isHook) => {
  const { onStart, onComplete, onFail, onSuccess, useSockets, authorization, contentType, headers, ...rest } = config;
  onStart && (await onStart({ action, method, path, input, body, isHook, config }));
  return new Promise((resolve, reject) =>
    sdkFetch(action, `${config.baseUrl}${path}`, { method, body, headers: { Authorization: authorization, "Content-Type": contentType, ...headers }, ...rest })
      .then(async (response) => {
        console.log({ response, isHook });
        if (isHook) {
          resolve(response.text ? response.text() : JSON.stringify(response.data));
          return;
        }
        const data = response.json();
        onSuccess && onSuccess({ data, response, action, method, path, input, body });
        onComplete && onComplete({ data, response, action, method, path, input, body });
        resolve(data);
      })
      .catch(async (error) => {
        console.log({ error });
        onFail && (await onFail({ error, action, method, path, input, body, isHook }));
        onComplete && (await onComplete({ error, action, method, path, input, body, isHook }));
        reject(error);
      })
  );
};
