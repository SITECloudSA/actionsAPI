
// This file is auto generated by 'actionapi' lib

import sdkFetch, { setConfig } from "actionapi/lib/client/fetcher"

import useSdkFetch from "actionapi/lib/client/useFetcher"

setConfig({ baseUrl: '/api', disableSocket: false, socketPath: '/ws' })

/**
  *
  * @type {import("actionapi/lib/type").SetSdkConfig} setSdkConfig
  * @returns void
  */
export const setSdkConfig = (globalconfig) => setConfig(globalconfig);

export const SDK = {

getAllProducts: () => sdkFetch('getAllProducts', 'GET', `/products/`, {} ),
getProduct: ({name}) => sdkFetch('getProduct', 'GET', `/products/name?name=${name ?? ""}`, {name} ),
getUser: ({name}) => sdkFetch('getUser', 'GET', `/users/${name}`, {name} ),
addUser: ({name,age}) => sdkFetch('addUser', 'POST', `/users/`, {name,age} , {name,age}),
getAllUsers: () => sdkFetch('getAllUsers', 'GET', `/users/`, {} ),

}

export const useSdk = {

getAllProducts: () => useSdkFetch('getAllProducts', 'GET', `/products/`, {} ),
getProduct: ({name}) => useSdkFetch('getProduct', 'GET', `/products/name?name=${name ?? ""}`, {name} ),
getUser: ({name}) => useSdkFetch('getUser', 'GET', `/users/${name}`, {name} ),
getAllUsers: () => useSdkFetch('getAllUsers', 'GET', `/users/`, {} ),

}

export const ACTIONS = {

getAllProducts: 'getAllProducts',getProduct: 'getProduct',getUser: 'getUser',addUser: 'addUser',getAllUsers: 'getAllUsers',
}

