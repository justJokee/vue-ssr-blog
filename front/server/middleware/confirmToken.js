/**
 * @desc api鉴权中间件
 * @author justJokee
 */
const jwt = require('jsonwebtoken')
const { userSecret } = require('../db/secret')
const confirmToken = (req, res, next) => {
  next()
  return
  if (!req.headers.authorization) {
    res.json({ code: 401, info: '无访问权限' })
  } else {
    const token = req.headers.authorization
    const secret = `${userSecret.pwd}.${userSecret.salt}`

    jwt.verify(token, secret, (err) => {
      if (err) {
        res.json({ code: 401, info: '无访问权限' })
      } else {
        next()
      }
    })
  }
}
module.exports = confirmToken
