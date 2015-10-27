import React from 'react'

import {debounce} from '../utils'

import languages from 'json!../languages.json'

export default ({onLangChange, onReset, lang, selectedFiles}) => (
  <footer className='app-footer'>
    <select
      onChange={debounce(onLangChange, 500)}
      value={lang}
    >
      { languages.map(lang =>
          <option
            key={lang.id}
            value={lang.id}
          >
            {lang.name}
          </option>
        )
      }
    </select>
    <button
      className='reset-btn'
      onClick={onReset}
      disabled={!selectedFiles.length}
    >
      New search
    </button>
  </footer>
)
