const express = require('express')
const router = express.Router()
const db = require('../db/')
const md5 = require('js-md5')
const confirmToken = require('../middleware/confirmToken')
const secret = require('../secret')
router.patch('/api/reviseKey', confirmToken, (req, res) => {
  let salt = secret.salt
  let pwd = md5(req.body.newKey + salt)
  db.user.find({ user: 'admin' }, (err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      if (doc[0].password === md5(req.body.oldKey + doc[0].salt)) {
        db.user.update({ user: 'admin' }, { password: pwd, salt: salt }, (err, doc) => {
          if (err) {
            res.status(500).end()
          } else {
            res.json({ code: 200 })
          }
        })
      } else {
        res.json({ code: 'oldkey-401' })
      }
    }
  })
})
module.exports = router
