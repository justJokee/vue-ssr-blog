/**
 * @desc 检查端口占用并返回一个可用端口
 */
const net = require('net')

module.exports = function checkPort() {
  return new Promise(resolve => {
    // eslint-disable-next-line no-extra-semi
    ;(function serverport(_port = 6180) {
      // let pt = _port || 8080;
      let pt = _port
      probe(pt, function(bl, _pt) {
        // 端口被占用 bl 返回false
        // _pt：传入的端口号
        if (bl === true) {
          resolve(_pt)
        } else {
          serverport(_pt + 1)
        }
      })
    })()
  })
}

function probe(port, callback) {
  let servers = net.createServer().listen(port)
  let calledOnce = false
  let timeoutRef = setTimeout(function() {
    calledOnce = true
    callback(false, port)
  }, 2000)
  timeoutRef.unref()
  servers.on('listening', function() {
    clearTimeout(timeoutRef)
    if (servers) servers.close()
    if (!calledOnce) {
      calledOnce = true
      callback(true, port)
    }
  })
  servers.on('error', function(err) {
    clearTimeout(timeoutRef)
    let result = true
    if (err.code === 'EADDRINUSE') result = false
    if (!calledOnce) {
      calledOnce = true
      callback(result, port)
    }
  })
}
