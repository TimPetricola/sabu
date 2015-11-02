import * as ActionTypes from '../actions/index'

import {getDefaultLang} from '../utils'

const initialState = {
  selectedFiles: [],
  lang: getDefaultLang(),
  requesting: false,
  online: true
}

function editSelectedFile (state, filepath, editFn) {
  return Object.assign({}, state, {
    selectedFiles: state.selectedFiles.map((file) => {
      if (file.path === filepath) {
        return editFn(file)
      } else {
        return file
      }
    })
  })
}

function editSub (state, filepath, subId, editFn) {
  return editSelectedFile(state, filepath, (file) => {
    return Object.assign({}, file, {
      subtitles: file.subtitles.map((sub) => {
        if (sub.IDSubtitleFile === subId) {
          return editFn(sub)
        } else {
          return sub
        }
      })
    })
  })
}

export default function sabuReducer (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SUBTITLES_REQUEST:
      return Object.assign({}, state, {
        selectedFiles: [...state.selectedFiles, {
          path: action.filepath,
          subtitles: [],
          requesting: true
        }]
      })

    case ActionTypes.SUBTITLES_RECEIVED:
      return editSelectedFile(state, action.filepath, (file) => {
        return Object.assign({}, file, {
          subtitles: action.subtitles,
          requesting: false
        })
      })

    case ActionTypes.SUBTITLE_DOWNLOAD:
      return editSub(state, action.filepath, action.subId, (sub) => {
        return Object.assign({}, sub, {
          downloading: true,
          downloaded: false
        })
      })

    case ActionTypes.SUBTITLE_DOWNLOADED:
      return editSub(state, action.filepath, action.subId, (sub) => {
        return Object.assign({}, sub, {
          downloading: false,
          downloaded: true
        })
      })

    case ActionTypes.LANG_CHANGED:
      return Object.assign({}, state, {
        lang: action.lang
      })

    case ActionTypes.RESET:
      return Object.assign({}, state, {
        selectedFiles: [],
        requesting: false
      })

    case ActionTypes.SET_ONLINE:
      return Object.assign({}, state, {
        online: true
      })

    case ActionTypes.SET_OFFLINE:
      return Object.assign({}, state, {
        online: false
      })

    default:
      return state
  }
}
