/**
 * @desc 文章分类
 */
const express = require('express')
const router = express.Router()
const db = require('../db/')
// const confirmToken = require('../middleware/confirmToken')

// 获取分类列表
router.get('/api/front/category/get', async (req, res) => {
  try {
    const doc = await db.category.find({}).sort({ _id: -1 })
    res.json({
      status: 0,
      data: doc,
      info: '获取文档分类成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
