import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import SabuApp from './components/SabuApp'
import {searchSubtitles, requestSubtitles} from './actions'

import './styles/index.css'

import configureStore from './store/configureStore'

const ipc = window.require('ipc')
const store = configureStore()

// Prevent browser from loading file on drop
document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

// Listen to events from the main process
ipc.on('file-hash', (filepath, data) => {
  store.dispatch(searchSubtitles(filepath, data))
})

ipc.on('open-paths', (paths) => {
  store.dispatch(requestSubtitles(paths))
})

ReactDOM.render(
  <Provider store={store}>
    <SabuApp />
  </Provider>,
  document.getElementById('app')
)
