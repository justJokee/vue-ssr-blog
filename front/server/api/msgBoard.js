/**
 * @desc 留言板管理
 * @author justJokee
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const api = require('../http/')
const confirmToken = require('../middleware/confirmToken')

// 获取留言列表
router.get('/api/front/messageBoard/gets', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  const ip = getIp(req)
  try {
    const total = await db.msgBoard.count({ parentId: null })
    const totalAll = await db.msgBoard.count({})
    const doc = await db.msgBoard.aggregate([
      { $match: { parentId: null } },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: db.msgBoard.collection.name,
          let: { pid: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$parentId', '$$pid'] } } },
            { $sort: { _id: -1 } },
            { $set: { liked: 0 } }
          ],
          as: 'reply'
        }
      },
      { $set: { liked: 0 } }
    ])
    let ids = doc
      .map((item) => {
        item.replyTotal = 0

        if (item.reply && item.reply.length) {
          // 一级留言统计挂载的总回复数，不管是不是回复自己
          item.replyTotal = item.reply.length
          return item.reply.map((erp) => erp._id.toString()).concat(item._id.toString())
        }
        return item._id.toString()
      })
      .flat()

    const existed = await db.commentIp.find({ ip, type: 0, like: 1, msgid: { $in: ids } })

    if (existed.length) {
      const ipIds = existed.map((ee) => ee.msgid.toString())
      doc.forEach((d) => {
        if (ipIds.includes(d._id.toString())) d.liked = 1
        d.replyTotal = 0
        if (d.reply && d.reply.length) {
          // 一级评论统计挂载的总回复数，不管是不是回复自己
          d.replyTotal = d.reply.length
          d.reply.forEach((er) => {
            if (ipIds.includes(er._id.toString())) er.liked = 1
          })
        }
      })
    }

    res.json({
      status: 200,
      data: doc,
      total,
      totalAll,
      page: parseInt(req.query.page)
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 赞 +1/-1
router.patch('/api/front/messageBoard/like', async (req, res) => {
  try {
    const ip = getIp(req)
    const existed = await db.commentIp.find({ ip, type: 0, msgid: req.body._id })
    // 点赞
    if (parseInt(req.body.inc) === 1) {
      // 此ip已经点赞过此条评论
      if (existed && existed.length && existed[0].like > 0) {
        res.json({
          status: 101,
          info: '您已经点过赞了 ~'
        })
      } else {
        if (!existed.length) {
          // ip评论关联表存储
          await db
            .commentIp({
              type: 0,
              msgid: req.body._id,
              ip: getIp(req),
              like: 1,
              createTime: new Date()
            })
            .save()
        } else
          await db.commentIp.updateMany(
            { ip: getIp(req), msgid: req.body._id },
            { $set: { like: 1, updateTime: new Date() } }
          )

        // 更新留言表
        await db.msgBoard.update({ _id: req.body._id }, { $inc: { like: 1 } })
        const doc = await db.msgBoard.find({ _id: req.body._id })
        res.json({
          status: 200,
          data: {
            _id: req.body._id,
            like: doc[0].like,
            liked: 1
          },
          info: '点赞成功'
        })
      }
    }
    // 取消赞
    else if (parseInt(req.body.inc) === -1 && existed.length && existed[0].like === 1) {
      await db.msgBoard.update({ _id: req.body._id }, { $inc: { like: -1 } })
      await db.commentIp.update({ ip: getIp(req), msgid: req.body._id }, { $set: { like: 0 } })
      const doc = await db.msgBoard.find({ _id: req.body._id })
      res.json({
        status: 200,
        data: {
          _id: req.body._id,
          like: doc[0].like,
          liked: 0
        },
        info: '取消的是赞，受伤的是心 ಥ﹏ಥ'
      })
    }
  } catch (e) {
    res.status(500).end()
  }
})

//后台留言板抓取
router.get('/api/getAdminBoard', confirmToken, (req, res) => {
  let limit = 10
  let skip = req.query.page * limit - limit

  db.msgBoard
    .find({}, (err, doc) => {
      if (err) {
        res.status(500).end()
      } else {
        res.json(doc)
      }
    })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
})
// 留言存储
router.post('/api/front/messageBoard/save', async (req, res) => {
  try {
    const { name, imgUrl, email, link, content, parentId, aite } = req.body
    const doc = await new db.msgBoard({
      name,
      imgUrl,
      email,
      link,
      content,
      parentId,
      aite,
      like: 0
    }).save()
    res.json({
      status: 200,
      data: doc
    })
    if (process.env.NODE_ENV === 'production') {
      const ipInfo = await api.get('https://ip.help.bj.cn', { ip: getIp(req) })
      if (ipInfo.status === '200' && ipInfo.data.length) {
        const info = ipInfo.data[0]
        await new db.news({
          type: 'msgboard',
          ip: info.ip,
          lng: info.adlng,
          lat: info.adlat,
          nation: info.nation,
          province: info.province,
          city: info.city,
          district: info.district,
          leaveMessageId: doc._id,
          content: doc.content,
          read: 0,
          date: new Date()
        }).save()
      }
    }
  } catch (e) {
    res.status(500).end()
  }
})

/***********后台管理留言**************/

// 筛选留言
router.get('/api/admin/messageBoard/search', confirmToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  delete req.query.page
  delete req.query.limit
  let regex = {}
  if (req.query.keyword) {
    regex.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { content: { $regex: req.query.keyword, $options: 'i' } }
    ]
    delete req.query.keyword
  }
  try {
    const doc = await db.msgBoard
      .find({
        ...req.query,
        ...regex
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    const total = await db.msgBoard.count({ ...req.query, ...regex })

    res.json({
      status: 200,
      data: doc,
      total,
      info: '搜索留言成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 添加留言
router.post('/api/admin/messageBoard/save', confirmToken, async (req, res) => {
  try {
    let { name, imgUrl, email, link, content, parentId, aite } = req.body
    if (!parentId) parentId = null
    // 存储文章评论
    const commentDoc = await new db.msgBoard({
      name,
      imgUrl,
      email,
      link,
      content,
      parentId,
      aite,
      like: 0,
      admin: 1,
      date: new Date()
    }).save()

    res.json({
      status: 200,
      data: commentDoc,
      info: '管理员留言成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 删除留言
router.delete('/api/admin/messageBoard/del', confirmToken, async (req, res) => {
  try {
    const params = typeof req.query.id === 'string' ? { _id: req.query.id } : { _id: { $in: req.query.id } }
    await db.msgBoard.remove(params)
    res.json({
      status: 200,
      info: '删除留言成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
module.exports = router
