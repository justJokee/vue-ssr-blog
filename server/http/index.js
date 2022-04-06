const axios = require('axios')
const qs = require('qs')
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'

function ajax(type, url, options) {
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: url,
      // baseURL: "https://www.mapblog.cn",
      baseURL: process.env.BASE_URL,
      params: type === 'get' ? options : null,
      data: type !== 'get' ? qs.stringify(options) : null
    })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject('request error in ' + url)
        }
      })
      .catch((err) => {
        console.error(err, url)
        reject(err)
      })
  })
}
const config = {
  get(url, options) {
    return new Promise((resolve, reject) => {
      ajax('get', url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  post(url, options) {
    return new Promise((resolve, reject) => {
      ajax('post', url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  patch(url, options) {
    return new Promise((resolve, reject) => {
      ajax('patch', url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  put(url, options) {
    return new Promise((resolve, reject) => {
      ajax('put', url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  delete(url, options) {
    return new Promise((resolve, reject) => {
      ajax('delete', url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}

module.exports = config
