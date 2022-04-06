const axios = require('axios')
const qs = require('qs')
import { errorCode } from '@/utils/errorCode'
import { Message } from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//response拦截器
axios.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    let errRes = JSON.parse(JSON.stringify(error))
    if (errRes && errRes.response && errRes.response.status === 500) {
      _message('warning', '服务器错误')
    }
    return Promise.reject(error)
  }
)
function ajax(type, url, options) {
  return new Promise((resolve, reject) => {
    axios({
      method: type,
      url: url,
      baseURL: process.env.BASE_URL,
      params: type === 'get' ? options : null,
      data: type !== 'get' ? qs.stringify(options) : null
    })
      .then((res) => {
        if (res.status === 200) {
          errorCode(res.data.status)
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
    return ajax('get', url, options)
  },
  post(url, options) {
    return ajax('post', url, options)
  },
  patch(url, options) {
    return ajax('patch', url, options)
  },
  put(url, options) {
    return ajax('put', url, options)
  },
  delete(url, options) {
    return ajax('delete', url, options)
  }
}

function _message(t, m) {
  Message({
    type: t,
    message: m,
    center: true
  })
}

export default config
