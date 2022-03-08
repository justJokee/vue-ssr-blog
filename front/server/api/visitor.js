/**
 * @desc 访客信息处理
 */

const express = require('express')
const { Octokit } = require('@octokit/core')
const api = require('../http/server-api')
const router = express.Router()
const db = require('../db/')
const secret = require('../db/secret')

// 存储访客信息
router.post('/api/front/visitor/save', async (req, res) => {
  try {
    // 自定义用户
    if (req.body.type === '0') {
      const exist = await db.visitor.find({ name: req.body.name })
      if (exist.length) {
        res.json({ status: 100, info: '用户名已存在' })
        return
      }
    }

    const doc = await new db.visitor(req.body).save()

    res.json({
      status: 200,
      data: doc,
      info: '访客信息存储成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 查看访客是否已经被存储
router.post('/api/front/visitor/existed', async (req, res) => {
  try {
    // QQ用户
    if (req.body.type === '1') {
      const exist = await db.visitor.find({ qqOpenId: req.body.qqOpenId })
      if (exist.length) {
        // 仅更新昵称和头像
        await db.visitor.update(
          { qqOpenId: req.body.qqOpenId },
          { $set: { name: req.body.name, imgUrl: req.body.imgUrl } }
        )
        const doc = await db.visitor.find({ qqOpenId: req.body.qqOpenId })
        res.json({ status: 200, info: '访客信息已存在', data: { info: doc[0], _saved: 1 } })
        return
      }
    }
    res.json({
      status: 200,
      data: {
        _saved: 0
      },
      info: '访客信息不存在'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// github登录

router.get('/login/git', (req, res) => {
  //请替换为自己的client_id
  let path = `https://github.com/login/oauth/authorize?client_id=${secret.github_client_id}&scope=['user']&redirect_uri=http://localhost:6180/login_github`
  res.redirect(path)
  res.status(200).end()
})
router.get('/login_github', (req, res) => {
  try {
    const params = {
      client_id: secret.github_client_id,
      client_secret: secret.github_client_secret,
      code: req.query.code,
      scope: ['user'],
      redirect_uri: 'http://localhost:6180/login_github'
    }
    api
      .post('https://github.com/login/oauth/access_token', JSON.parse(JSON.stringify(params)))
      .then(fullData => {
        const arr1 = fullData.split('&')
        const arr2 = arr1[0].split('=')
        const token = arr2[1]
        return token
      })
      .then(async token => {
        let userInfo = {}
        const octokit = new Octokit({ auth: `${token}` })
        const info = await octokit.request('GET /user')
        // 查看访客表是否已经存在此用户
        const visitor = await db.visitor.find({ githubId: info.data.id })
        // 存在此用户
        if (visitor.length) {
          await db.visitor.update(
            { githubId: info.data.id },
            { $set: { name: info.data.login, imgUrl: info.data.avatar_url } }
          )
          const doc = await db.visitor.find({ githubId: info.data.id })
          userInfo = {
            ...doc[0].toObject(),
            // 前端判断存在的标识
            _saved: 1
          }
        }
        res.render('gc_back.html', { title: 'github登陆成功', userInfo: JSON.stringify(userInfo) })
      })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
