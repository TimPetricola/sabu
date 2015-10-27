import { createStore, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import reducer from '../reducers'

const middlewares = []
middlewares.push(thunk)

if (remote.process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger())
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore)

export default function configureStore (initialState) {
  return createStoreWithMiddleware(reducer, initialState)
}
