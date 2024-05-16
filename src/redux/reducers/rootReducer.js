// ** Redux Imports
import { combineReducers } from 'redux'
import PluggedInModules from "../../configs/PluggedInModules"

// ** Basic Modules Reducers
import coreReducers from '@store/reducers/basicReducer'
import _ from "lodash"

// ** Merge Reducers
const FinalReducers = {}

// ** Merge Routes
_.forEach(PluggedInModules, (module, _i) => {
  FinalReducers[_i] = module.path.Reducer
})

const rootReducer = combineReducers({
  ...coreReducers,
  ...FinalReducers
})

export default rootReducer
