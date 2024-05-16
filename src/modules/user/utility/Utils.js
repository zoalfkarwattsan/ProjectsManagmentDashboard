import axios from 'axios'
import qs from 'qs'
import {createBrowserHistory} from 'history'

import {store} from '@fwsrc/redux/storeConfig/store'
import {_logout} from "../redux/actions"
import {_setGlobal, _getGlobal, _loading, _historyPush, _isOnline, API} from "@utils"
import _ from "lodash"
import PluggedInModules from "@fwsrc/configs/PluggedInModules"

//************************************//
export function _setAPIToken(token) {
	API.defaults.headers['Authorization'] = `Bearer ${token}`
	_.forEach(PluggedInModules, (module, _i) => {
		if (module.path.Axios) {
			_.forEach(module.path.Axios, (API, _i) => {
				module.path.Axios[_i].defaults.headers['Authorization'] = `Bearer ${token}`
			})
		}
	})
}

//************************************//
export function _setAPILang(lang) {
	API.defaults.headers['lang'] = lang
	_.forEach(PluggedInModules, (module, _i) => {
		if (module.path.API) {
			module.path.API.defaults.headers['lang'] = lang
		}
	})
}

export const isUserLoggedIn = () => (store.getState().user.token)
export const getUserData = () => (store.getState().user.userData)

