/**
 * @desc api鉴权中间件
 * @author justJokee
 */
const verify = require('../utils/verify')
const confirmToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.json({ status: 401, info: '无访问权限或token已过期' })
  } else {
    const token = req.headers.authorization

    verify(token, (err) => {
      if (err) {
        res.json({ status: 401, info: '无访问权限或token已过期' })
      } else {
        next()
      }
    })
  }
}
module.exports = confirmToken
