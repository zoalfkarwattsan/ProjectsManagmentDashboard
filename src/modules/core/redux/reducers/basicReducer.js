// ** Redux Imports
import { combineReducers } from 'redux'

// ** Reducers Imports
import {appReducer as app} from './app'
import navbar from './navbar'
import layout from './layout'

const basicReducers = {
  app,
  navbar,
  layout
}

export default basicReducers
