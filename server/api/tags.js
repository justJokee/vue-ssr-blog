/**
 * @desc 文章标签
 * @author justJokee
 */
const express = require('express')
const router = express.Router()
const db = require('../db/')

// 获取文档标签统计数量
router.get('/api/front/tags/count', async (req, res) => {
  try {
    const tags = await db.article.aggregate([
      { $match: { publish: 1 } },
      { $unwind: '$tag' },
      { $group: { _id: '$tag', total: { $sum: 1 } } },
      { $project: { tag: '$_id', _id: 0, total: 1 } }
    ])
    res.json({
      status: 200,
      data: tags,
      total: tags.length,
      info: '获取标签统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
