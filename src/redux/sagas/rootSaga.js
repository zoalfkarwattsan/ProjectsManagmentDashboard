import {all, fork} from 'redux-saga/effects'
import PluggedInModules from "../../configs/PluggedInModules"
import _ from "lodash"

let FinalSagas = []

// ** Merge Sagas
_.forEach(PluggedInModules, (module, _i) => {
	if (module.path.Sagas) {
		FinalSagas = [...FinalSagas, fork(module.path.Sagas)]
	}
})

export default function* () {
	yield all(FinalSagas)
}
