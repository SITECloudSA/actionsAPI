
// This file is auto generated by 'actionapi' lib

import { setConfig } from "actionapi/lib/client/fetcher"

setConfig({ baseUrl: '/api', disableSocket: false, socketPath: '/ws' })

/**
  *
  * @type {import("actionapi/lib/type").SetSdkConfig} setSdkConfig
  * @returns void
  */
export const setSdkConfig = (globalconfig) => setConfig(globalconfig);

export const ACTIONS = {

getAllProducts: 'getAllProducts',getProduct: 'getProduct',getUser: 'getUser',addUser: 'addUser',getAllUsers: 'getAllUsers',
}

export * as SDK from './sdk'
export * as useSdk from './hooks'