const express = require('express')
const api = require('../http/server-api')
const router = express.Router()
const db = require('../db/')
//自定义用户名
router.get('/api/searchUser', (req, res) => {
  db.vistor.find({ name: req.query.name }, (err, doc) => {
    if (doc.length) {
      res.json({ exist: 'yes' })
    } else {
      res.json({ exist: 'no' })
    }
  })
})
router.post('/api/saveDesignUser', (req, res) => {
  new db.vistor(req.body).save((err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json({ code: 200 })
    }
  })
})
//github登录
router.get('/api/getGithub', (req, res) => {
  db.vistor.find({ githubID: req.query.id }, (err, doc) => {
    if (err) {
      res.status(500).end()
    } else {
      res.json(doc)
    }
  })
})
router.get('/login/git', (req, res) => {
  //请替换为自己的client_id
  let path = "https://github.com/login/oauth/authorize?client_id=YourID&scope=['user']"
  res.redirect(path)
})
router.get('/login_github', (req, res) => {
  //请替换为自己的client_id和client_secret
  let params = {
    client_id: 'YourID',
    client_secret: 'Your Secret',
    code: req.query.code,
    scope: ['user'],
    redirect_uri: 'http://localhost:6180/login_github'
  }
  api
    .post('https://github.com/login/oauth/access_token', params)
    .then(fullData => {
      let arr1 = fullData.split('&')
      let arr2 = arr1[0].split('=')
      let token = arr2[1]
      return token
    })
    .then(token => {
      api
        .get('https://api.github.com/user', { access_token: token })
        .then(user_info => {
          db.vistor.find({ githubID: user_info.id }, (err, doc) => {
            if (err) {
              res.status(500).end()
            } else {
              if (!doc.length) {
                new db.vistor({
                  name: user_info.login,
                  imgUrl: user_info.avatar_url,
                  githubID: user_info.id
                }).save()
              }
              res.cookie('githubId', user_info.id, { maxAge: 1000 * 60 * 60 * 24 })
              res.status(200).end()
            }
          })
        })
        .catch(err => {
          res.status(500).end()
        })
    })
    .catch(err => {
      res.status(500).end()
    })
})

module.exports = router
