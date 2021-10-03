const express = require('express')
const router = express.Router()
const db = require('../db/')
const localTime = require('../utils/reviseTime')
const confirmToken = require('../middleware/confirmToken')
router.get('/api/getMsgBoard', (req, res) => {
  let limit = 8
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
router.post('/api/saveLeaveW', (req, res) => {
  new db.msgBoard(req.body).save((err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(doc)
      new db.newMsg({
        type: 'msgboard',
        name: req.body.name,
        say: req.body.content,
        content: req.body.name + '在' + localTime(Date.now()) + '给你留言啦~~'
      }).save()
    }
  })
})
router.patch('/api/addReply', (req, res) => {
  let reply = {
    name: req.body.name,
    imgUrl: req.body.imgUrl,
    email: req.body.email,
    content: req.body.content,
    date: req.body.date,
    aite: req.body.aite
  }
  db.msgBoard.findByIdAndUpdate({ _id: req.body.id }, { $push: { reply: reply } }, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(doc)
    }
  })
})
//后台管理删除二级留言
router.patch('/api/reduceLeavewords', confirmToken, (req, res) => {
  db.msgBoard.update({ _id: req.body.mainId }, { $pull: { reply: { _id: req.body.secondId } } }, (err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json({ deleteCode: 200 })
    }
  })
})
router.delete('/api/removeLeavewords', confirmToken, (req, res) => {
  //因为用到批量删除，所以删除项的_id均放到数组中
  db.msgBoard.remove({ _id: { $in: req.query.id } }, err => {
    if (err) {
      res.status(500).end()
    } else {
      res.json({ deleteCode: 200 })
    }
  })
})
module.exports = router
