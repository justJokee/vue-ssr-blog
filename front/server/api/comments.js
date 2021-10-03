const express = require('express')
const router = express.Router()
const db = require('../db/')
const localTime = require('../utils/reviseTime')
const confirmToken = require('../middleware/confirmToken')
//获取文章评论
router.get('/api/getComments', (req, res) => {
  let limit = 5000
  //TODO: page param
  let skip = 1 * limit - limit

  db.comment.aggregate(
    [
      { $match: { parentId: null } },
      { $match: { articleId: parseInt(req.query.articleId) } },
      {
        $lookup: {
          from: db.comment.collection.name,
          let: { pid: '$_id' },
          pipeline: [{ $match: { $expr: { $eq: ['$parentId', '$$pid'] } } }, { $sort: { _id: -1 } }],
          as: 'reply'
        }
      },

      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: limit }
    ],
    (err, doc) => {
      if (err) {
        res.status(500).end
      } else {
        res.json(doc)
      }
    }
  )
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
//添加文章评论
router.post('/api/saveComment', (req, res) => {
  new db.comment(req.body).save((err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(doc)
      if (doc.parentId === null) {
        db.article.update({ articleId: req.body.articleId }, { $inc: { commentNum: 1 } }, (err, doc) => {
          if (err) {
            res.status(500).end()
          }
        })
      }

      new db.newMsg({
        type: 'comment',
        name: req.body.name,
        say: req.body.content,
        content: req.body.name + '在' + localTime(Date.now()) + '评论了你的文章--' + req.body.title
      }).save()
    }
  })
})
// 评论点赞
router.patch('/api/addLike', (req, res) => {
  db.comment.update({ _id: req.body.revId }, { $inc: { like: req.body.addOrDel } }, (err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json({ code: 200 })
    }
  })
})
module.exports = router
