export const settings = {
  config: {},
};

/**
 * setting global configuration to SDK generator
 * @param {Object} globalconfig config
 * @param {String} globalconfig.baseUrl string
 * @param {Function} globalconfig.onSuccess funtion
 * @param {Function} globalconfig.onFail function
 * @param {Boolean} globalconfig.useSockets boolean
 */
export const setConfig = (globalconfig) => (settings.config = { ...settings.config, ...globalconfig });

export default (...args) => fetch(...args);
