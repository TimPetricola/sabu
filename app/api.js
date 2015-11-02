const xml = window.remote.require('xml-mapping')
const fs = window.remote.require('fs')

import getHash from './hash'

import * as templates from './api-payloads'

const DEFAULT_HOST = 'api.opensubtitles.org'
const DEFAULT_PROTOCOL = 'http'
const DEFAULT_ENDPOINT = '/xml-rpc'

function parseXmlResult (raw) {
  let result = {}

  if (raw == null) { return null }

  raw.struct.member.forEach((entry) => {
    // Only keep string values
    if (!entry.value.string) { return }
    result[entry.name.$t] = entry.value.string.$t
  })

  return result
}

class Api {
  constructor(opts) {
    this.token = null

    this.options = Object.assign({
      host: DEFAULT_HOST,
      protocol: DEFAULT_PROTOCOL,
      endpoint: DEFAULT_ENDPOINT
    }, opts)

    this.deferredRequests = []
  }

  login() {
    return this._request(templates.login)
      .then(members => members.find(member => member.name.$t === 'token'))
      .then(member => member.value.string.$t)
      .then(token => (this.token = token))
      .then(() => {
        this.deferredRequests.forEach(({callback, args}) => callback(...args))
      })
      .then(() => this.token)
  }

  logout() {
    return new Promise((resolve) => {
      if (this.token) {
        this._request(templates.logout).then(() => {
          this.token = null
          resolve()
        })
      } else {
        resolve()
      }
    })
    return this._request(templates.logout).then(() => {
      const token = this.token
      this.token = null
      return token
    })
  }

  search(lang, params) {
    return this._loggedInRequest((resolve) => {
      this._request(templates.search, {lang, params})
        .then(members => members.find(member => member.name.$t === 'data'))
        .then(member => member.value.array.data.value)
        .then(resultsXml => resultsXml instanceof Array ? resultsXml : [resultsXml])
        .then(resultsXml => resultsXml.map(parseXmlResult))
        .then(subs => subs.filter(sub => sub != null))
        .then(resolve)
    })
  }

  searchFile(lang, path) {
    const sizePromise = new Promise(function (resolve) {
      fs.stat(path, (err, stats) => resolve(stats.size))
    })

    const hashPromise = getHash(path)

    return Promise.all([sizePromise, hashPromise])
      .then(([size, hash]) => this.search(lang, { moviehash: hash, moviebytesize: size }))
  }

  searchQuery(lang, query) {
    return this.search(lang, { query: query })
  }

  _request(template, params = {}) {
    const endpoint = this.options.protocol + '://' + this.options.host + this.options.endpoint
    const body = template(Object.assign(params, {token: this.token}))

    return fetch(endpoint, { method: 'post', body: body })
      .then(res => res.text())
      .then(raw => xml.load(raw))
      .then(json => json.methodResponse.params.param.value.struct.member)
  }

  // Ensure token exists before running executor
  _loggedInRequest(executor) {
    if (this.token) {
      return new Promise(executor)
    } else {
      return new Promise((resolve, reject) => {
        this.deferredRequests.push({callback: executor, args: [resolve, reject]})
        this.login()
      })
    }
  }
}

export default new Api()
