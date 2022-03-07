/**
 * @desc 豆瓣电影
 */
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs-extra')
// const confirmToken = require('../middleware/confirmToken')

// 获取分类列表
router.get('/api/front/douban/get', async (req, res) => {
  try {
    const page = req.query.page || 1
    const type = req.query.type || 'collect'
    const tp = path.join(__dirname, '..', `files/movies/${type}/${page}.json`)
    const exist = fs.existsSync(tp)

    if (exist) {
      const doc = fs.readFileSync(tp, 'utf8')
      const pageTotal = fs.readFileSync(path.join(__dirname, '..', `files/movies/${type}/pageTotal.txt`), 'utf8')
      res.json({
        status: 200,
        data: JSON.parse(doc),
        pageTotal: parseInt(pageTotal) || 1,
        info: '获取影视记录成功'
      })
    } else {
      res.json({
        status: 404,
        data: [],
        info: '数据不存在'
      })
    }
  } catch (e) {
    console.log('指令错误--->>>', e)
    res.status(500).end()
  }
})

module.exports = router
