const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const confirmToken = require('../middleware/confirmToken')
const api = require('../http/')

// 获取文章评论
router.get('/api/front/comments/get', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  const ip = getIp(req)
  try {
    const total = await db.comment.count({ articleId: parseInt(req.query.articleId), parentId: null })
    const doc = await db.comment.aggregate([
      { $match: { parentId: null } },
      { $match: { articleId: parseInt(req.query.articleId) } },
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
      .map(item => {
        if (item.reply && item.reply.length) {
          return item.reply.map(erp => erp._id.toString()).concat(item._id.toString())
        }
        return item._id.toString()
      })
      .flat()
    const existed = await db.commentIp.find({ ip, type: 1, like: 1, msgid: { $in: ids } })
    if (existed.length) {
      const ipIds = existed.map(ee => ee.msgid.toString())
      doc.forEach(d => {
        if (ipIds.includes(d._id.toString())) d.liked = 1
        if (d.reply && d.reply.length) {
          d.reply.forEach(er => {
            if (ipIds.includes(er._id.toString())) er.liked = 1
          })
        }
      })
    }
    res.json({
      status: 200,
      data: doc,
      total,
      page: parseInt(req.query.page)
    })
  } catch (e) {
    res.status(500).end()
  }
})
//添加文章评论
router.post('/api/front/comments/save', async (req, res) => {
  try {
    // 存储文章评论
    const commentDoc = await new db.comment({
      ...req.body,
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
    if (process.env.NODEW_ENV === 'production') {
      const ipInfo = await api.get('https://ip.help.bj.cn', { ip: getIp(req) })
      console.log('返回ip信息===>>>>', ipInfo)
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
              like: 1
            })
            .save()
        } else await db.commentIp.updateMany({ ip: getIp(req), msgid: req.body._id }, { $set: { like: 1 } })

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
      await db.commentIp.update({ ip: getIp(req), msgid: req.body._id }, { $set: { like: 0 } })
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

//后台管理获取所有文章评论
router.get('/api/getAdminComments', confirmToken, (req, res) => {
  const limit = 10
  const skip = req.query.page * limit - limit
  db.comment
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
//后台管理删除评论 TODO:  前端进行吧区分一二级的逻辑去掉
router.delete('/api/removeComments', confirmToken, (req, res) => {
  db.comment.remove({ _id: { $in: req.query.id } }, err => {
    if (err) {
      res.status(500).end()
    } else {
      //删除一级评论，联动文章评论数
      if (req.query.level === 1) {
        db.article.update({ articleId: req.query.articleId }, { $inc: { commentNum: -1 } }, (err, doc) => {
          if (err) {
            res.status(500)
          }
        })
      }
      res.json({ deleteCode: 200 })
    }
  })
})

module.exports = router
