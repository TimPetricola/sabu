import React from 'react'

import languages from 'json!../languages.json'

export default ({onLangChange, onReset, lang, videoFiles}) => (
  <footer className='app-footer'>
    <select
      onChange={onLangChange}
      value={lang}
      disabled={videoFiles.length}
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
      className='btn reset-btn'
      onClick={onReset}
      disabled={!videoFiles.length}
    >
      New search
    </button>
  </footer>
)
