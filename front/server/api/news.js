/**
 * @desc 消息管理
 * @author justJokee
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const confirmToken = require('../middleware/confirmToken')

// 获取消息列表
router.get('/api/admin/news/gets', confirmToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10
    const skip = req.query.page * limit - limit
    delete req.query.page
    delete req.query.limit
    const doc = await db.news
      .find({ ...req.query })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    const total = await db.news.count({ ...req.query })

    res.json({
      status: 200,
      data: doc,
      total,
      info: '获取消息成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 已读消息
router.patch('/api/admin/news/read', confirmToken, async (req, res) => {
  try {
    const params = typeof req.body.id === 'string' ? { _id: req.body.id } : { _id: { $in: req.body.id } }
    await db.news.updateMany(params, { $set: { read: 1 } })
    res.json({
      status: 200,
      info: '设置已读消息成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 获取所有未读消息数量
router.get('/api/admin/news/unReadTotal', confirmToken, async (req, res) => {
  try {
    const total = await db.news.count({ read: 0 })
    res.json({
      status: 200,
      total,
      info: '未读消息数量统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 将所有消息设置为已读
router.patch('/api/admin/news/readAll', confirmToken, async (req, res) => {
  try {
    await db.news.updateMany({ read: 0 }, { $set: { read: 1 } })
    res.json({
      status: 200,
      info: '设置所有消息已读成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 删除消息
router.delete('/api/admin/news/del', confirmToken, async (req, res) => {
  try {
    const params = typeof req.query.id === 'string' ? { _id: req.query.id } : { _id: { $in: req.query.id } }
    await db.news.remove(params)
    res.json({
      status: 200,
      info: '删除消息成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
