import api from '../api'

const remote = window.remote
const http = remote.require('http')
const fs = remote.require('fs')
const zlib = remote.require('zlib')
const path = remote.require('path')

export const API_LOGIN_SUCCESS = 'API_LOGIN_SUCCESS'
export const API_LOGOUT_SUCCESS = 'API_LOGOUT_SUCCESS'

export const SUBTITLES_REQUEST = 'SUBTITLES_REQUEST'
export const SUBTITLES_RECEIVED = 'SUBTITLES_RECEIVED'
export const SUBTITLES_NOT_FOUND = 'SUBTITLES_RECEIVED'

export const SUBTITLE_DOWNLOAD = 'SUBTITLE_DOWNLOAD'
export const SUBTITLE_DOWNLOADED = 'SUBTITLE_DOWNLOADED'

export const LANG_CHANGED = 'LANG_CHANGED'

export const RESET = 'RESET'

export const SET_ONLINE = 'SET_ONLINE'
export const SET_OFFLINE = 'SET_OFFLINE'

export function apiLogin () {
  return function (dispatch) {
    return api.login().then((token) => dispatch({
      type: API_LOGIN_SUCCESS,
      token
    }))
  }
}

export function apiLogout () {
  return function (dispatch, getState) {
    const token = getState().apiToken

    if (token) {
      api.logout(token).then(() => dispatch({
        type: API_LOGOUT_SUCCESS
      }))
    }
  }
}

export function requestSubtitles (filepath) {
  return function (dispatch, getState) {
    dispatch({type: SUBTITLES_REQUEST, filepath})

    const {lang, apiToken} = getState()

    api.searchFile(apiToken, lang, filepath).then((subtitles) => {
      dispatch({type: SUBTITLES_RECEIVED, filepath, subtitles})
    })
  }
}

export function downloadSubtitle (filepath, subId) {
  return function (dispatch, getState) {
    dispatch({
      type: SUBTITLE_DOWNLOAD,
      filepath: filepath,
      subId: subId
    })

    const file = getState().selectedFiles.find(f => f.path === filepath)
    const sub = file.subtitles.find(s => s.IDSubtitleFile === subId)

    const moviePath = path.resolve(filepath)
    const movieExt = path.extname(moviePath)
    const movieDir = path.dirname(moviePath)
    const movieName = path.basename(moviePath, movieExt)

    const subPath = `${movieDir}/${movieName}.${sub.ISO639}.srt`

    const subFile = fs.createWriteStream(subPath)

    const request = http.get(sub.SubDownloadLink, function (response) {
      const gunzip = zlib.createGunzip()

      response.pipe(gunzip).pipe(subFile)

      subFile.on('close', function () {
        dispatch({
          type: SUBTITLE_DOWNLOADED,
          filepath: filepath,
          subId: subId
        })

        response.unpipe(gunzip)
        response.unpipe(subFile)
      })

      gunzip.on('error', () => fs.unlink(subFile))
    })

    request.on('error', () => fs.unlink(subFile))
  }
}

export function setLang (lang) {
  return {
    type: LANG_CHANGED,
    lang: lang
  }
}

export function reset () {
  return {
    type: RESET
  }
}

export function setOnline () {
  return {
    type: SET_ONLINE
  }
}

export function setOffline () {
  return {
    type: SET_OFFLINE
  }
}
