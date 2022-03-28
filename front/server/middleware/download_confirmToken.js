/*下载请求是在a标签中发起的，所以token在请求参数中带上，故重写token验证函数*/
const jwt = require('jsonwebtoken')
const secret = require('../db/secret')
const download_confirmToken = (req, res, next) => {
  if (!req.query.authToken) {
    res.status(401).end()
  } else {
    const token = req.query.authToken
    jwt.verify(token, secret.jwtSecret, (err) => {
      if (err) {
        res.status(401).end()
      } else {
        console.log('通过')
        next()
      }
    })
  }
}
module.exports = download_confirmToken
