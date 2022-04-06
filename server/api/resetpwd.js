const express = require('express')
const router = express.Router()
const db = require('../db/')
const confirmToken = require('../middleware/confirmToken')

router.patch('/api/admin/pwd/reset', confirmToken, async (req, res) => {
  const user = await db.user.find({ _id: req.body.uid })
  if (user.length) {
    // 旧密码不正确
    if (req.body.oldPassword !== user[0].password) {
      res.json({
        status: 201,
        info: '旧密码不正确'
      })
    } else {
      await db.user.update({ _id: req.body.uid }, { $set: { password: req.body.password } })
      res.json({
        status: 200,
        info: '密码修改成功，请重新登录'
      })
    }
  } else {
    res.json({
      status: 104,
      info: '用户不存在'
    })
  }
})
module.exports = router
