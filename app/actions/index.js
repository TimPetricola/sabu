import api from '../api'
import {setDefaultLang, sanitizeSubtitles} from '../utils'

const remote = window.remote
const http = remote.require('http')
const fs = remote.require('fs')
const zlib = remote.require('zlib')
const path = remote.require('path')
const ipc = window.require('ipc')

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

export function searchSubtitles (filepath, {hash, size}) {
  return function (dispatch, getState) {
    const filename = path.basename(filepath)
    const {lang} = getState()

    api.searchHash(lang, hash, size).then((subtitles) => {
      subtitles = sanitizeSubtitles(subtitles, filepath)
      if (subtitles.length) {
        dispatch({type: SUBTITLES_RECEIVED, filepath, subtitles})
      } else {
        api.searchQuery(lang, filename).then((subtitles) => {
          subtitles = sanitizeSubtitles(subtitles, filepath)
          dispatch({type: SUBTITLES_RECEIVED, filepath, subtitles})
        })
      }
    })
  }
}

export function requestSubtitles (filepaths) {
  return function (dispatch, getState) {
    const paths = [].concat(filepaths)

    paths.forEach(filepath => dispatch({type: SUBTITLES_REQUEST, filepath}))

    // Let main process do the hashing
    ipc.send('file-hash', paths)
  }
}

export function downloadSubtitle (filepath, subId) {
  return function (dispatch, getState) {
    dispatch({
      type: SUBTITLE_DOWNLOAD,
      filepath: filepath,
      subId: subId
    })

    const file = getState().videoFiles.find(f => f.path === filepath)
    const sub = file.subtitles.find(s => s.id === subId)

    const dir = path.dirname(filepath)

    const subPath = `${dir}/${file.name}.${sub.langIso639}.srt`

    const subFile = fs.createWriteStream(subPath)

    const request = http.get(sub.downloadLink, function (response) {
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
