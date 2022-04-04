/**
 * @desc 登录鉴权
 * @author justJokee
 */
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const db = require('../db/')
const { userSecret } = require('../db/secret')

const createToken = (id, account) => {
  const secret = `${userSecret.salt}`
  return jwt.sign(
    {
      id: id,
      account: account
    },
    secret,
    { expiresIn: '4h' }
  )
}
// 登录验证
router.post('/api/admin/login', async (req, res) => {
  try {
    const user = await db.user.find({ account: req.body.account })
    // 用户名不存在，返回401
    if (!user.length) {
      res.json({
        status: 402,
        info: '用户名或密码不正确'
      })
      return
    }
    const pwd = user[0].password
    if (req.body.password === pwd) {
      const token = createToken(user[0]._id, user[0].account)
      res.json({
        status: 200,
        data: {
          token,
          uid: user[0]._id,
          account: user[0].account,
          avatar: user[0].avatar,
          lastLoginTime: user[0].lastLoginTime
        },
        info: '登陆成功'
      })
      // 更新登录时间
      await db.user.update({ user: req.body.user }, { lastLoginTime: new Date() })
    } else {
      res.json({
        status: 402,
        info: '用户名或密码不正确'
      })
    }
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
