import * as ActionTypes from '../actions/index'

import {getDefaultLang} from '../utils'

const path = remote.require('path')

const initialState = {
  videoFiles: [],
  lang: getDefaultLang(),
  requesting: false,
  online: true
}

function editvideoFile (state, filepath, editFn) {
  return Object.assign({}, state, {
    videoFiles: state.videoFiles.map((file) => {
      if (file.path === filepath) {
        return editFn(file)
      } else {
        return file
      }
    })
  })
}

function editSub (state, filepath, subId, editFn) {
  return editvideoFile(state, filepath, (file) => {
    return Object.assign({}, file, {
      subtitles: file.subtitles.map((sub) => {
        if (sub.id === subId) {
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
      const {filepath} = action
      const name = path.basename(filepath, path.extname(filepath))

      return Object.assign({}, state, {
        videoFiles: [...state.videoFiles, {
          path: filepath,
          name: name,
          subtitles: [],
          requesting: true,
          requestFinishedAt: null
        }]
      })

    case ActionTypes.SUBTITLES_RECEIVED:
      return editvideoFile(state, action.filepath, (file) => {
        return Object.assign({}, file, {
          subtitles: action.subtitles,
          requesting: false,
          requestFinishedAt: new Date()
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
        videoFiles: [],
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
