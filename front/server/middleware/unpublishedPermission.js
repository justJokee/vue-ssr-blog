/**
 * @desc  对于前后端通用的文章系列接口，阻断前端对草稿箱的访问
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @author justJokee
 */
const jwt = require('jsonwebtoken')
const { userSecret } = require('../db/secret')
const unpublishedPermission = (req, res, next) => {
  if (req.publish === '0') {
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
  } else next()
}
module.exports = unpublishedPermission
