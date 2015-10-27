const remote = window.remote
const fs = remote.require('fs')
const Buffer = remote.require('buffer').Buffer

function padLeft (str, c, length) {
  while (str.length < length) {
    str = c.toString() + str
  }
  return str
}

function sumHex64bits (n1, n2) {
  if (n1.length < 16) { n1 = padLeft(n1, '0', 16) }
  if (n2.length < 16) { n2 = padLeft(n2, '0', 16) }

  // 1st 32 bits
  const i_0 = parseInt(n1.substr(0, 8), 16) + parseInt(n2.substr(0, 8), 16)

  // 2nd 32 bits
  const i_1 = parseInt(n1.substr(8, 8), 16) + parseInt(n2.substr(8, 8), 16)

  // back to hex
  let h_1 = i_1.toString(16)

  let i_1_over = 0

  if (h_1.length > 8) {
    i_1_over = parseInt(h_1.substr(0, h_1.length - 8), 16)
  } else {
    h_1 = padLeft(h_1, '0', 8)
  }

  return (i_1_over + i_0).toString(16) + h_1.substr(-8)
}

function checksumBuffer (buffer, length) {
  let checksum = 0

  for (var i = 0; i < (buffer.length / length); i++) {
    const checksum_hex = read64LE(buffer, i)
    checksum = sumHex64bits(checksum.toString(), checksum_hex).substr(-16)
  }

  return checksum
}

function read64LE (buffer, offset) {
  const ret_64_be = buffer.toString('hex', offset * 8, ((offset + 1) * 8))
  const t = []

  for (var i = 0; i < 8; i++) {
    t.push(ret_64_be.substr(i * 2, 2))
  }

  t.reverse()

  return t.join('')
}

function getBufferChecksum (fd, t_buffer, chunk_size) {
  return new Promise(function (resolve, reject) {
    fs.read(fd, t_buffer.buf, 0, chunk_size * 2, t_buffer.offset,
      function (err, bytesRead, buffer) {
        if (err) {
          reject(err)
          return
        }

        resolve(checksumBuffer(buffer, 16))
      })
  })
}

function getHash (filename) {
  const chunk_size = 65536
  const buf_start = new Buffer(chunk_size * 2)
  const buf_end = new Buffer(chunk_size * 2)
  const t_chksum = []

  // / calculate the file hash
  return new Promise(function (resolve, reject) {
    fs.stat(filename, function (err, stat) {
      if (err) {
        reject(err)
        return
      }

      const file_size = stat.size

      // / add initial t_chksum
      t_chksum.push(file_size.toString(16))

      // / open the file as read-only
      fs.open(filename, 'r', function (err, fd) {
        if (err) {
          reject(err)
          return
        }

        return getBufferChecksum(fd, { buf: buf_start, offset: 0 }, chunk_size)
          .then(function (r) {
            t_chksum.push(r)
          })
          .then(function () {
            return getBufferChecksum(fd, { buf: buf_end, offset: file_size - chunk_size }, chunk_size)
          })
          .then(function (r) {
            t_chksum.push(r)
          })
          .then(function () {
            var chksum = sumHex64bits(t_chksum[0], t_chksum[1])
            chksum = sumHex64bits(chksum, t_chksum[2])
            chksum = chksum.substr(-16)
            chksum = padLeft(chksum, '0', 16)

            resolve(chksum)
          })
          .catch(reject)
      })
    })
  })
}

export default getHash
