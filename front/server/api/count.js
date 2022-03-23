/**
 * @desc 统计类
 */
const express = require('express')
const router = express.Router()
const db = require('../db/')
// const confirmToken = require('../middleware/confirmToken')

// 获取分类列表
router.get('/api/admin/count', async (req, res) => {
  try {
    const article = await db.article.find({}).count()
    const comment = await db.comment.find({}).count()
    const msgBoard = await db.msgBoard.find({}).count()
    const visitor = await db.visitor.find({}).count()
    res.json({
      status: 200,
      data: {
        total: {
          article,
          visitor,
          comment,
          msgBoard
        }
      },
      info: '资源统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
