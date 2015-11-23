var ipc = require('ipc')

const host = (function () {
  const callbacks = {}

  const on = function (channel, callback) {
    callbacks[channel] = callback
  }

  ipc.on('ipc-promised', function (event, uuid, channel, options) {
    new Promise(function(resolve, reject) {
      callbacks[channel](resolve, reject, options)
    }).then(function (data) {
      event.sender.send('ipc-promised-resolve', uuid, data)
    }).catch(function (data) {
      event.sender.send('ipc-promised-reject', uuid, data)
    })
  })

  return {
    on: on
  }
})()

module.exports = host
