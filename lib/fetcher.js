export const settings = {
  config: {
    baseUrl: "https://3000.code.cloud.site.sa/",
  },
};

/**
 * @param globalconfig
 * @param globalconfig.baseUrl string
 * @param globalconfig.onSuccess funtion
 * @param globalconfig.onFail function
 * @param globalconfig.useSockets boolean
 */
export const setConfig = (globalconfig) => (settings.config = { ...settings.config, ...globalconfig });

export default (...args) => fetch(...args);
