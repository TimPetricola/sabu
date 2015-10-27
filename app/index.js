import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import SabuApp from './components/SabuApp'

import './styles/index.css'

import configureStore from './store/configureStore'

const store = configureStore()

document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

ReactDOM.render(
  <Provider store={store}>
    <SabuApp />
  </Provider>,
  document.getElementById('app')
)
