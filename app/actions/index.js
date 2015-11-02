import api from '../api'
import {setDefaultLang} from '../utils'

const remote = window.remote
const http = remote.require('http')
const fs = remote.require('fs')
const zlib = remote.require('zlib')
const path = remote.require('path')

export const SUBTITLES_REQUEST = 'SUBTITLES_REQUEST'
export const SUBTITLES_RECEIVED = 'SUBTITLES_RECEIVED'
export const SUBTITLES_NOT_FOUND = 'SUBTITLES_RECEIVED'

export const SUBTITLE_DOWNLOAD = 'SUBTITLE_DOWNLOAD'
export const SUBTITLE_DOWNLOADED = 'SUBTITLE_DOWNLOADED'

export const LANG_CHANGED = 'LANG_CHANGED'

export const RESET = 'RESET'

export const SET_ONLINE = 'SET_ONLINE'
export const SET_OFFLINE = 'SET_OFFLINE'

// Not making anything out of this one, so no dispatch
export function apiLogin () {
  return function () {
    return api.login()
  }
}

// Not making anything out of this one, so no dispatch
export function apiLogout () {
  return function () {
    return api.logout()
  }
}

export function requestSubtitles (filepath) {
  return function (dispatch, getState) {
    dispatch({type: SUBTITLES_REQUEST, filepath})

    const {lang} = getState()
    const filename = path.basename(filepath)

    api.searchFile(lang, filepath).then((subtitles) => {
      if (subtitles.length) {
        dispatch({type: SUBTITLES_RECEIVED, filepath, subtitles})
      } else {
        api.searchQuery(lang, filename).then((subtitles) => {
          dispatch({type: SUBTITLES_RECEIVED, filepath, subtitles})
        })
      }
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
  setDefaultLang(lang)

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
