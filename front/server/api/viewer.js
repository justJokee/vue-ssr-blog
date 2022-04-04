/**
 * @desc 访客信息
 * @author justJokee
 */

const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')
const getBrowser = require('../utils/getBrowser')
const getOS = require('../utils/getOS')

// 统计访客数量、信息(按前端刷新次数计算)
router.get(['/', '/app/*'], async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const ip = getIp(req)
      const browser = getBrowser(req.headers['user-agent'])
      const system = getOS(req.headers['user-agent'])
      await new db.viewer({
        ip,
        count: 1,
        browser: browser,
        system: system,
        date: new Date()
      }).save()
    }
    next()
  } catch (e) {
    next()
  }
})
// 按天返回某一段时间范围内的访客数量
router.get('/api/admin/viewer/history', async (req, res) => {
  try {
    const doc = await db.viewer.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(parseInt(req.query.start)),
            $lte: new Date(parseInt(req.query.end))
          }
        }
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
        }
      },
      {
        $group: {
          _id: '$date',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          value: '$total',
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ])
    res.json({
      status: 200,
      data: doc,
      info: '查询访问记录成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 查询访客设备信息
router.get('/api/front/viewer/getDevice', async (req, res) => {
  try {
    const browser = await db.viewer.aggregate([
      {
        $group: {
          _id: '$browser',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$total',
          _id: 0
        }
      }
    ])
    const system = await db.viewer.aggregate([
      {
        $group: {
          _id: '$system',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: '$total',
          _id: 0
        }
      }
    ])

    res.json({
      status: 200,
      data: { browser, system },
      info: '访客设备信息统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 查询访客总数
router.get('/api/front/admin/count', async (req, res) => {
  try {
    const total = await db.viewer.find({}).count()
    const doc = await db.viewer.find({}).sort({ _id: -1 }).limit(1)
    res.json({
      status: 200,
      data: { total, latest: doc[0] },
      info: '访客设备信息统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
module.exports = router
