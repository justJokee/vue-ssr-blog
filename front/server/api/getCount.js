const express = require('express')
const router = express.Router()
const db = require('../db/')
router.get('/api/getCount', (req, res) => {
  let publish = req.query.publish === 'false' ? false : true
  //首页请求
  if (!req.query.tag && !req.query.start && !req.query.key) {
    db.article.count({ publish: publish }, (err, num) => {
      res.json(num)
    })
  }
  //通过文章标签请求
  if (req.query.tag) {
    let tag = req.query.tag
    db.article.count({ publish: publish, tag: tag }, (err, num) => {
      res.json(num)
    })
  }
  //前台后台时间范围请求
  if (req.query.start) {
    let start = new Date(parseInt(req.query.start))
    let end = new Date(parseInt(req.query.end))
    db.article.count({ publish: req.query.publish, date: { $gte: start, $lte: end } }, (err, num) => {
      if (err) {
        res.status(500).end()
      } else {
        res.json(num)
      }
    })
  }
  //前台后台关键词搜索请求
  if (req.query.key) {
    db.article.count({ publish: req.query.publish, title: { $regex: req.query.key, $options: 'i' } }, (err, num) => {
      if (err) {
        res.status(500).end()
      } else {
        res.json(num)
      }
    })
  }
})
router.get('/api/getMsgCount', (req, res) => {
  db.msgBoard.count({}, (err, num) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(num)
    }
  })
})
router.get('/api/getCommentsCount', (req, res) => {
  db.comment.count({}, (err, num) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(num)
    }
  })
})
module.exports = router
