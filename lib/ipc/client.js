const ipc = window.require('ipc')

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

const client = (function () {
  const promises = {}

  const send = function (channel, options) {
    return new Promise((resolve, reject) => {
      const id = uuid()
      promises[id] = { resolve, reject }
      ipc.send('ipc-promised', id, channel, options)
    })
  }

  const on = (channel, callback) => (
    ipc.on(channel, callback)
  )

  ipc.on('ipc-promised-resolve', (uuid, data) => {
    promises[uuid].resolve(data)
    delete promises[uuid]
  })

  ipc.on('ipc-promised-reject', (uuid, data) => {
    promises[uuid].reject(data)
    delete promises[uuid]
  })

  return {
    on,
    send
  }
})()

export default client
