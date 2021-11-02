const axios = require('axios')
const qs = require('qs')
const LRU = require('lru-cache')
require('es6-promise').polyfill()
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
function ajax(type, url, options) {
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: url,
      // baseURL: "http://localhost: 6180",
      params: options,
      data: qs.stringify(options)
    })
      .then(_res => {
        if (_res.status === 200) {
          resolve(_res.data)
        } else {
          reject('request error in ' + url)
        }
      })
      .catch(err => {
        console.log(err, url)
      })
  })
}
const config = {
  get(url, options) {
    return new Promise((resolve, reject) => {
      ajax('get', url, options).then(data => {
        resolve(data)
      })
    })
  },
  post(url, options) {
    return new Promise((resolve, reject) => {
      ajax('post', url, options).then(data => {
        resolve(data)
      })
    })
  },
  patch(url, options) {
    return new Promise((resolve, reject) => {
      ajax('patch', url, options).then(data => {
        resolve(data)
      })
    })
  }
}

module.exports = config
