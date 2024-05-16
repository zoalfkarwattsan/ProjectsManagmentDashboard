// ** Redux, Thunk & Root Reducer Imports
import thunk from 'redux-thunk'
import createDebounce from 'redux-debounced'
import rootReducer from '../reducers/rootReducer'
import rootSaga from '../sagas/rootSaga'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

// ** init middleware
const middleware = [thunk, createDebounce()]

// ** Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const sagaMiddleware = createSagaMiddleware()

// ** Create store
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(sagaMiddleware, ...middleware))
)
sagaMiddleware.run(rootSaga)
export { store }
