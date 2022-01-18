/**
 * @desc 文章相关
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const api = require('../http/')
const confirmToken = require('../middleware/confirmToken')
const unpublishedPermission = require('../middleware/unpublishedPermission')

// 获取文章列表 / 按分类筛选文章
router.get('/api/front/article/gets', unpublishedPermission, async (req, res) => {
  const params = { publish: req.query.publish }
  if (req.query.categoryId) params.categoryId = req.query.categoryId
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  const project = req.query.content == '0' ? { content: 0 } : {}
  if (req.query.tag) params.tag = req.query.tag
  try {
    const total = await db.article.count(params)
    const articles = await db.article
      .find(params, project)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
    res.json({
      status: 200,
      data: articles,
      total,
      page: parseInt(req.query.page)
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 获取文章详细信息
router.get('/api/front/article/detail', unpublishedPermission, async (req, res) => {
  const { publish, articleId } = req.query
  try {
    const detail = await db.article.find({ publish, articleId })
    res.json({
      status: 200,
      data: detail[0] || {}
    })

    // 获取访客信息
    if (process.env.NODEW_ENV === 'production') {
      // 更新pv
      await db.article.update({ articleId }, { $inc: { pv: 1 } })
      const ipInfo = await api.get('https://ip.help.bj.cn', { ip: getIp(req) })
      if (ipInfo.status === '200' && ipInfo.data.length) {
        const info = ipInfo.data[0]
        await new db.news({
          type: 'pv',
          ip: info.ip,
          lng: info.adlng,
          lat: info.adlat,
          nation: info.nation,
          province: info.province,
          city: info.city,
          district: info.district,
          articleId: detail[0]._id,
          date: new Date()
        }).save()
      }
    }
  } catch (e) {
    res.status(500).end()
  }
})
// 获得上一篇文章和下一篇文章
router.get('/api/front/article/prevnext', async (req, res) => {
  try {
    const prev = await db.article
      .find({ publish: 1, date: { $lt: req.query.date } }, { articleId: 1, title: 1, headerPic: 1 })
      .sort({ _id: -1 })
      .limit(1) //pre使用倒序查询，否则只会显示第一条数据，因为它是最早的
    const next = await db.article
      .find({ publish: 1, date: { $gt: req.query.date } }, { articleId: 1, title: 1, headerPic: 1 })
      .limit(1)
    res.json({
      status: 200,
      data: {
        prev: prev.length ? prev[0] : null,
        next: next.length ? next[0] : null
      }
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 更新文章喜欢字段
router.patch('/api/front/article/like', async (req, res) => {
  try {
    const ip = getIp(req)
    const existed = await db.commentIp.find({ ip, type: 2, msgid: req.body._id })
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
          // ip关联表存储
          await db
            .commentIp({
              type: 2,
              msgid: req.body._id,
              ip: getIp(req),
              like: 1,
              date: new Date()
            })
            .save()
        } else {
          await db.commentIp.updateMany(
            { ip: getIp(req), msgid: req.body._id },
            { $set: { like: 1, updateTime: new Date() } }
          )
        }

        // 更新文章表喜欢字段
        await db.article.update({ _id: req.body._id }, { $inc: { likeNum: 1 } })
        const doc = await db.article.find({ _id: req.body._id }, { likeNum: 1 })

        res.json({
          status: 200,
          data: {
            _id: req.body._id,
            like: doc[0].likeNum,
            liked: 1
          },
          info: '点赞成功'
        })
      }
    }
    // 取消赞
    else if (parseInt(req.body.inc) === -1 && existed.length && existed[0].like === 1) {
      await db.article.update({ _id: req.body._id }, { $inc: { likeNum: -1 } })
      await db.commentIp.update({ ip: getIp(req), msgid: req.body._id }, { $set: { like: 0, updateTime: new Date() } })
      const doc = await db.article.find({ _id: req.body._id }, { likeNum: 1 })
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

// 文章搜索
router.get('/api/front/article/search', unpublishedPermission, async (req, res) => {
  const limit = 8
  const skip = req.query.page * limit - limit
  try {
    const searchDoc = await db.article
      .find(
        {
          publish: 1,
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { content_plain: { $regex: req.query.keyword, $options: 'i' } }
          ]
        },
        { content: 0 }
      )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
    if (searchDoc.length) {
      const keyword = req.query.keyword
      searchDoc.forEach(doc => {
        // title高亮关键词
        doc.title = doc.title.replace(new RegExp(keyword, 'gi'), `<span class='search-keyword'>${keyword}</span>`)
        // content截取首次出现关键词的片段，并高亮关键词
        const index = doc.content_plain.indexOf(keyword)
        const start = index === -1 ? 0 : index - 50
        const end = index === -1 ? 100 : index + 50
        const dot = doc.content_plain.length > end ? '...' : ''
        doc.content_plain = doc.content_plain.substring(start, end)
        doc.content_plain =
          doc.content_plain.replace(new RegExp(keyword, 'gi'), `<span class='search-keyword'>${keyword}</span>`) + dot
      })
    }
    res.json({
      status: 200,
      data: searchDoc,
      info: '搜索成功'
    })
  } catch (e) {
    res.status(500).end()
  }

  ////
  // if (req.query.according === 'key') {
  //   //前台时间轴根据时间范围搜索
  // } else {
  //   const start = new Date(parseInt(req.query.start))
  //   const end = new Date(parseInt(req.query.end))
  //   db.article
  //     .find({ publish: req.query.publish, date: { $gte: start, $lte: end } }, { content: 0 }, (err, doc) => {
  //       if (err) {
  //         res.status(500).end()
  //       } else {
  //         res.json(doc)
  //       }
  //     })
  //     .sort({ _id: -1 })
  //     .skip(skip)
  //     .limit(limit)
  // }
})
// 文章归档
router.get('/api/front/article/archives', async (req, res) => {
  try {
    const doc = db.article.aggregate([
      { $match: {} },
      { $sort: { _id: -1 } },
      { $project: { time: { $dateToString: { format: '%Y-%m', date: '$date' } }, pv: 1 } },
      { $group: { _id: '$time', total: { $sum: 1 } } },
      { $project: { time: '$_id', _id: 0, total: 1 } }
    ])
    res.json({
      status: 200,
      data: doc,
      info: '归档查询成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 推荐文章
router.get('/api/front/article/hot', (req, res) => {
  db.article
    .find({ publish: 1 }, { title: 1, articleId: 1, tag: 1 }, { sort: { pv: -1 } }, (err, doc) => {
      if (err) {
        res.status(500).end()
      } else {
        res.json(doc)
      }
    })
    .limit(5)
})

/***********后台管理文章： 改动 删除 修改**************/

// 修改文章
router.patch('/api/admin/article/update', confirmToken, (req, res) => {
  const { publish, original, title, abstract, tag, content } = req.body
  db.article.update(
    { articleId: req.body.articleId },
    { publish, original, title, abstract, tag, content },
    (err, doc) => {
      if (err) {
        res.status(500).end()
      } else {
        res.json({ code: 200 })
      }
    }
  )
})
// 存储文章
router.post('/api/admin/article/save', confirmToken, (req, res) => {
  const { original, title, abstract, content, tag, publish, date } = req.body
  new db.article({
    articleId: 0,
    original,
    title,
    abstract,
    content,
    tag,
    publish,
    date: date,
    commentNum: 0,
    likeNum: 0,
    pv: 0
  }).save((err, doc) => {
    if (err) {
      res.json({ code: 500 })
    } else {
      res.json({ code: 200 })
    }
  })
})
// 删除文章
router.delete('/api/admin/article/del', confirmToken, (req, res) => {
  //$in是为了批量删除，出入的articleId是数组
  db.article.remove({ articleId: { $in: req.query.articleId } }, err => {
    if (err) {
      res.status(500).end()
    } else {
      res.json({ deleteCode: 200 })
      db.comment.remove({ articleId: { $in: req.query.articleId } }, err => {
        if (err) {
          console.log(err)
        }
      })
    }
  })
})

module.exports = router
