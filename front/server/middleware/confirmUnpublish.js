/**
 * @desc  对于前后端通用的文章系列接口，阻断前端对草稿箱的访问
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * @author justJokee
 */
const verify = require('../utils/verify')
const confirmUnpublish = (req, res, next) => {
  if (req.publish === '0') {
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
  } else next()
}
module.exports = confirmUnpublish
