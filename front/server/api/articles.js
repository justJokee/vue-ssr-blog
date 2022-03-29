/**
 * @desc 文档
 * @author justJokee
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const api = require('../http/')
const confirmToken = require('../middleware/confirmToken')
const confirmUnpublish = require('../middleware/confirmUnpublish')

// 获取文章列表 / 按分类 / 按标签 筛选文章
router.get('/api/front/article/gets', confirmUnpublish, async (req, res) => {
  const params = {}
  if (req.query.publish) params.publish = req.query.publish
  if (req.query.categoryId) params.categoryId = req.query.categoryId
  if (req.query.tag) params.tag = { $in: [req.query.tag] }
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  const project = req.query.content == '0' ? { content: 0, content_plain: 0 } : {}
  if (req.query.tag) params.tag = req.query.tag
  try {
    const total = await db.article.count(params)
    const articles = await db.article.find(params, project).sort({ _id: -1 }).skip(skip).limit(limit)
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
router.get('/api/front/article/detail', async (req, res) => {
  const { articleId, excludeContent } = req.query
  const project = excludeContent
    ? { content: 0, content_plain: 0, content_draft: 0 }
    : { content_plain: 0, content_draft: 0 }
  try {
    const detail = await db.article.find({ publish: 1, articleId }, project)

    res.json({
      status: 200,
      data: detail[0] || {}
    })

    // 获取访客信息
    if (process.env.NODE_ENV === 'production') {
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
      .find({ publish: 1, createTime: { $lt: req.query.createTime } }, { articleId: 1, title: 1, headerPic: 1 })
      .sort({ _id: -1 })
      .limit(1) //pre使用倒序查询，否则只会显示第一条数据，因为它是最早的
    const next = await db.article
      .find({ publish: 1, createTime: { $gt: req.query.createTime } }, { articleId: 1, title: 1, headerPic: 1 })
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
router.get('/api/front/article/search', confirmUnpublish, async (req, res) => {
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
        { content: 0, content_plain: 0, content_draft: 0 }
      )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
    if (searchDoc.length) {
      const keyword = req.query.keyword
      searchDoc.forEach((doc) => {
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
})
// 文章归档
router.get('/api/front/article/archives', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = (req.query.page || 1) * limit - limit
  // 按年统计
  let group = [
    { $group: { _id: '$year', total: { $sum: 1 }, months: { $push: '$$ROOT' } } },
    { $project: { year: '$_id', _id: 0, total: 1, months: 1 } },
    { $sort: { year: -1 } }
  ]
  // 按月统计
  if (req.query.countType === 'month') {
    group = [
      { $group: { _id: '$month', total: { $sum: 1 } } },
      { $project: { month: '$_id', _id: 0, total: 1 } },
      { $sort: { month: -1 } }
    ]
  }

  try {
    let doc = []
    let total = 0
    // 按月筛选
    if (req.query.filter) {
      const pipe = [
        { $match: { publish: 1 } },
        {
          $project: {
            month: { $dateToString: { format: '%Y-%m', date: '$createTime' } },
            title: 1,
            createTime: 1,
            articleId: 1,
            headerPic: 1
          }
        },
        { $match: { month: req.query.month } }
      ]
      doc = await db.article.aggregate([...pipe, { $sort: { _id: -1 } }, { $skip: skip }, { $limit: limit }])
      // 兼容前端数据结构
      doc = [{ month: req.query.month, months: doc }]
      const totalRes = await db.article.aggregate([...pipe, { $count: 'total' }])
      total = totalRes[0].total
    } else {
      doc = await db.article.aggregate([
        { $match: { publish: 1 } },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            year: { $dateToString: { format: '%Y', date: '$createTime' } },
            month: { $dateToString: { format: '%Y-%m', date: '$createTime' } },
            title: 1,
            createTime: 1,
            articleId: 1,
            headerPic: 1
          }
        },
        ...group
      ])
      total = await db.article.count({ publish: 1 })
    }

    res.json({
      status: 200,
      data: doc,
      total,
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

/***********后台管理文章： 改动 删除 修改 TODO:待重构**************/

// 获取文章详细信息
router.get('/api/admin/article/getDraft', confirmToken, async (req, res) => {
  const { articleId, excludeContent } = req.query
  const project = excludeContent ? { content: 0, content_plain: 0, content_draft: 0 } : { content_plain: 0 }
  try {
    const detail = await db.article.find({ articleId }, project)
    const doc = detail[0].toObject()
    doc.content = doc.content_draft
    delete doc.content_draft
    res.json({
      status: 200,
      data: doc || {}
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 存储文档
router.post('/api/admin/article/save', confirmToken, async (req, res) => {
  try {
    const doc = await new db.article({
      ...req.body,
      content: '',
      content_plain: '',
      content_draft: '',
      publish: 0,
      commentNum: 0,
      likeNum: 0,
      pv: 0,
      editing: 0,
      createTime: new Date(),
      updateTime: new Date()
    }).save()

    res.json({
      status: 200,
      data: doc,
      info: '文档存储成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 编辑文档（保存、更新/发布）
router.patch('/api/admin/article/edit', confirmToken, async (req, res) => {
  const updates = {}
  try {
    if (Reflect.get(req.body, 'content')) {
      // 删除富文本中的标签等，保留静态文本字段
      updates.content_plain = req.body.content.replace(/<.*?>|\n|&nbsp;/g, '')
      // 默认存储为草稿
      updates.content_draft = req.body.content
      // 重要！一定要删除！
      delete req.body.content

      // 文档 发布/更新 content 与 content_draft保持一致同步
      if (req.body.editing === '0') {
        updates.content = updates.content_draft
      }
    }
    // 数据存储前获取原始发布状态
    const oldDoc = await db.article.find(
      { articleId: req.body.articleId },
      { content: 0, content_plain: 0, content_draft: 0 }
    )
    const oldPublish = oldDoc[0].publish
    await db.article.update(
      { articleId: req.body.articleId },
      {
        ...req.body,
        ...updates,
        updateTime: new Date()
      }
    )
    const doc = await db.article.find(
      { articleId: req.body.articleId },
      { content: 0, content_plain: 0, content_draft: 0 }
    )
    // 状态不一致说明发布状态已变更，更新分类表的统计字段
    if (oldPublish != doc[0].publish) {
      const inc = doc[0].publish ? 1 : -1
      await db.category.update({ _id: doc[0].categoryId }, { $inc: { total: inc } })
    }

    res.json({
      status: 200,
      data: doc[0],
      info: '文档编辑成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 删除文档
router.delete('/api/admin/article/del', confirmToken, async (req, res) => {
  try {
    const params = typeof req.query.id === 'string' ? { _id: req.query.id } : { _id: { $in: req.query.id } }
    // 维护分类表
    const articlesDoc = await db.article.find(params)
    if (articlesDoc.length) {
      articlesDoc.forEach(async (doc) => {
        if (doc.publish) {
          await db.category.update({ _id: doc.categoryId }, { $inc: { total: -1 } })
        }
      })
    }
    await db.article.remove(params)

    res.json({
      status: 200,
      info: '删除文档成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 筛选文章
router.get('/api/admin/article/search', confirmToken, async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const skip = req.query.page * limit - limit
  delete req.query.page
  delete req.query.limit
  let regex = {}
  if (req.query.keyword) {
    regex.$or = [
      { title: { $regex: req.query.keyword, $options: 'i' } },
      { content_plain: { $regex: req.query.keyword, $options: 'i' } }
    ]
    delete req.query.keyword
  }
  try {
    const doc = await db.article
      .find(
        {
          ...req.query,
          ...regex
        },
        { content: 0, content_plain: 0, content_draft: 0 }
      )
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    const total = await db.article.count({ ...req.query, ...regex })

    res.json({
      status: 200,
      data: doc,
      total,
      info: '搜索成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
module.exports = router
