/**
 * @desc 文章评论管理
 * @author justJokee
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const confirmToken = require('../middleware/confirmToken')
const api = require('../http/')

// 获取文章评论
router.get('/api/front/comments/get', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = (req.query.page || 1) * limit - limit
  const ip = req.query._ip || getIp(req)

  const articleFilter = Reflect.has(req.query, 'articleId') ? { articleId: parseInt(req.query.articleId) } : {}
  try {
    const total = await db.comment.count({ ...articleFilter, parentId: null })
    const totalAll = await db.comment.count({ ...articleFilter })
    const doc = await db.comment.aggregate([
      { $match: { parentId: null } },
      { $match: { ...articleFilter } },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: db.comment.collection.name,
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
          // 一级评论统计挂载的总回复数，不管是不是回复自己
          item.replyTotal = item.reply.length
          return item.reply.map((erp) => erp._id.toString()).concat(item._id.toString())
        }
        return item._id.toString()
      })
      .flat()
    // 查询访问ip是否点赞过即将获取的评论
    const existed = await db.commentIp.find({ ip, type: 1, like: 1, msgid: { $in: ids } })
    if (existed.length) {
      const ipIds = existed.map((ee) => ee.msgid.toString())
      doc.forEach((d) => {
        if (ipIds.includes(d._id.toString())) d.liked = 1
        if (d.reply && d.reply.length) {
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
// 获取最新的文章评论
router.get('/api/front/comments/new', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  try {
    const doc = await db.comment({}).sort({ _id: -1 }).skip(skip).limit(limit)
    res.json({
      status: 200,
      data: doc,
      info: '获取文章最新评论成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
//添加文章评论
router.post('/api/front/comments/save', async (req, res) => {
  try {
    const { articleId, name, imgUrl, email, link, content, parentId, aite } = req.body
    // 存储文章评论
    const commentDoc = await new db.comment({
      articleId,
      name,
      imgUrl,
      email,
      link,
      content,
      parentId,
      aite,
      like: 0,
      date: new Date()
    }).save()
    // 更新文章评论总数
    await db.article.update({ articleId: req.body.articleId }, { $inc: { commentNum: 1 } })
    res.json({
      status: 200,
      data: commentDoc,
      info: '评论成功'
    })
    // 新消息通知
    if (process.env.NODE_ENV === 'production') {
      const ipInfo = await api.get('https://ip.help.bj.cn', { ip: getIp(req) })
      if (ipInfo.status === '200' && ipInfo.data.length) {
        const info = ipInfo.data[0]
        await new db.news({
          type: 'comment',
          ip: info.ip,
          lng: info.adlng,
          lat: info.adlat,
          nation: info.nation,
          province: info.province,
          city: info.city,
          district: info.district,
          commentId: commentDoc._id,
          content: commentDoc.content,
          read: 0,
          date: new Date()
        }).save()
      }
    }
  } catch (e) {
    res.status(500).end()
  }
})
// 文章评论赞 +1/-1
router.patch('/api/front/comments/like', async (req, res) => {
  try {
    const ip = getIp(req)
    const existed = await db.commentIp.find({ ip, type: 1, msgid: req.body._id })
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
              type: 1,
              msgid: req.body._id,
              ip: getIp(req),
              like: 1,
              createTime: new Date()
            })
            .save()
        } else {
          await db.commentIp.updateMany(
            { ip: getIp(req), msgid: req.body._id },
            { $set: { like: 1, updateTime: new Date() } }
          )
        }

        // 更新留言表
        await db.comment.update({ _id: req.body._id }, { $inc: { like: 1 } })
        const doc = await db.comment.find({ _id: req.body._id })
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
      await db.comment.update({ _id: req.body._id }, { $inc: { like: -1 } })
      await db.commentIp.update({ ip: getIp(req), msgid: req.body._id }, { $set: { like: 0, updateTime: new Date() } })
      const doc = await db.comment.find({ _id: req.body._id })
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

/***********后台管理文章评论**************/

// 筛选评论
router.get('/api/admin/comments/search', confirmToken, async (req, res) => {
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
    const doc = await db.comment
      .find({
        ...req.query,
        ...regex
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    const total = await db.comment.count({ ...req.query, ...regex })

    res.json({
      status: 200,
      data: doc,
      total,
      info: '搜索评论成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 添加文章评论
router.post('/api/admin/comments/save', confirmToken, async (req, res) => {
  try {
    let { articleId, name, imgUrl, email, link, content, parentId, aite } = req.body
    if (!parentId) parentId = null
    // 存储文章评论
    const commentDoc = await new db.comment({
      articleId,
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
    // 更新文章评论总数
    await db.article.update({ articleId: req.body.articleId }, { $inc: { commentNum: 1 } })
    res.json({
      status: 200,
      data: commentDoc,
      info: '管理员回复成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 删除文章评论
router.delete('/api/admin/comments/del', confirmToken, async (req, res) => {
  try {
    const params = typeof req.query.id === 'string' ? { _id: req.query.id } : { _id: { $in: req.query.id } }

    await db.comment.remove(params)
    if (typeof req.query.articleId === 'object') {
      req.query.articleId.forEach(async (item) => {
        await db.article.update({ articleId: item }, { $inc: { commentNum: -1 } })
      })
    } else {
      await db.article.update({ articleId: req.query.articleId }, { $inc: { commentNum: -1 } })
    }

    res.json({
      status: 200,
      info: '删除评论成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
module.exports = router
