
// This file is auto generated by 'actionapi' lib

import sdkFetch, { setConfig } from "actionapi/lib/fetcher"

setConfig({ baseUrl: '/api' })

/**
  * onError middleware
  * @name onError
  * @function
  * @param {String} action action name that initiated the request
  * @param {Object=} error action's error
  */

/**
  * onSuccess middleware
  * @name onSuccess
  * @function
  * @param {String} action action name that initiated the request
  * @param {Object=} data action's respond
  * @returns {void}
  */

/**
  * setting global configuration to SDK generator
  * @param {Object} globalconfig config
  * @param {String=} globalconfig.baseUrl string
  * @param {onSuccess=} globalconfig.onSuccess funtion
  * @param {onError=} globalconfig.onFail function
  * @param {Boolean=} globalconfig.useSockets boolean
  */
export const setSdkConfig = (globalconfig) => setConfig(globalconfig);

export const SDK = {

getAllProducts: () => sdkFetch('getAllProducts', 'GET', `/products/`, {} ,),
getProduct: ({name}) => sdkFetch('getProduct', 'GET', `/products/name?name=${name || ""}`, {name} ,),
getAllUsers: () => sdkFetch('getAllUsers', 'GET', `/users/`, {} ,),
getUser: ({name}) => sdkFetch('getUser', 'GET', `/users/${name}`, {name} ,),
addUser: ({name,age}) => sdkFetch('addUser', 'POST', `/users/`, {name,age} ,{name,age}),

}