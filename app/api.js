import getHash from './hash'

const remote = window.remote

const xml = remote.require('xml-mapping')
const fs = remote.require('fs')

const API_URL = 'http://api.opensubtitles.org/xml-rpc'

function loginBodyRequest () {
  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>LogIn</methodName>
      <params>
        <param>
          <value>
            <string></string>
          </value>
        </param>
        <param>
          <value>
            <string></string>
          </value>
        </param>
        <param>
          <value>
            <string>en</string>
          </value>
        </param>
        <param>
          <value>
            <string>OpenSubtitlesPlayer v4.7</string>
          </value>
        </param>
      </params>
    </methodCall>`
}

function logoutBodyRequest (token) {
  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>LogOut</methodName>
      <params>
        <param>
          <value>
            <string>${token}</string>
          </value>
        </param>
      </params>
    </methodCall>`
}

function searchBodyRequest (token, lang, params = {}) {
  let paramsXml = ''

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      paramsXml += `
        <member>
          <name>${key}</name>
          <value>
            <string>${params[key]}</string>
          </value>
        </member>
      `
    }
  }

  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>SearchSubtitles</methodName>
      <params>
        <param>
          <value>
            <string>${token}</string>
          </value>
        </param>
        <param>
          <value>
            <array>
              <data>
                <value>
                  <struct>
                    <member>
                      <name>sublanguageid</name>
                      <value>
                        <string>${lang}</string>
                      </value>
                    </member>
                    ${paramsXml}
                  </struct>
                </value>
              </data>
            </array>
          </value>
        </param>
      </params>
    </methodCall>`
}

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

function apiRequest (body) {
  return fetch(API_URL, {
    method: 'post',
    body: body
  }).then(res => res.text())
    .then(raw => xml.load(raw))
    .then(json => json.methodResponse.params.param.value.struct.member)
}

function login () {
  return apiRequest(loginBodyRequest())
    .then(members => members.find(member => member.name.$t === 'token'))
    .then(member => member.value.string.$t)
}

function logout (token) {
  return apiRequest(logoutBodyRequest(token)).then(() => token)
}

function search (token, lang, params = {}) {
  return apiRequest(searchBodyRequest(token, lang, params))
    .then(members => members.find(member => member.name.$t === 'data'))
    .then(member => member.value.array.data.value)
    .then(resultsXml => resultsXml instanceof Array ? resultsXml : [resultsXml])
    .then(resultsXml => resultsXml.map(parseXmlResult))
    .then(subs => subs.filter(sub => sub != null))
}

function searchFile (token, lang, filepath) {
  const sizePromise = new Promise(function (resolve) {
    fs.stat(filepath, (err, stats) => resolve(stats.size))
  })

  const hashPromise = getHash(filepath)

  return Promise.all([sizePromise, hashPromise])
    .then(([size, hash]) => search(token, lang, { moviehash: hash, moviebytesize: size }))
}

function searchQuery (token, lang, query) {
  return search(token, lang, { query: query })
}

export default {login, logout, search, searchFile, searchQuery}
