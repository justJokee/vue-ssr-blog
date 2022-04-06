const axios = require('axios')
const qs = require('qs')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
function ajax(type, url, options) {
  let _params = {}
  if (type === 'get') _params = { params: options }
  if (type === 'post') _params = { data: qs.stringify(options) }
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: url,
      ..._params
    })
      .then((_res) => {
        if (_res.status === 200) {
          resolve(_res.data)
        } else {
          reject('request error in ' + url)
        }
      })
      .catch((err) => {
        console.log(err, url)
      })
  })
}
const config = {
  get(url, options) {
    return ajax('get', url, options)
  },
  post(url, options) {
    return ajax('post', url, options)
  },
  patch(url, options) {
    return ajax('patch', url, options)
  }
}

module.exports = config
