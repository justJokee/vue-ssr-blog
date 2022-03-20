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
// const confirmToken = require('../middleware/confirmToken')

// 统计访客数量、信息(按前端刷新次数计算)
router.get(['/', '/app/*'], async (req, res, next) => {
  try {
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
    next()
  } catch (e) {
    next()
  }
})
// 按天返回某一段时间范围内的访客数量
router.get('/api/front/viewer/history', async (req, res) => {
  try {
    const doc = db.viewer.aggragate([
      {
        $match: {
          date: {
            $gte: new Date(req.start),
            $lte: new Date(req.end)
          }
        }
      },
      { $sort: { _id: -1 } },
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
      }
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
router.get('/api/front/viewer/device/get', async (req, res) => {
  try {
    const browser = db.viewer.aggragate([
      {
        $group: {
          _id: '$browser',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          browser: '$_id',
          value: '$total',
          _id: 0
        }
      }
    ])
    const system = db.viewer.aggragate([
      {
        $group: {
          _id: '$system',
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          system: '$_id',
          value: '$total',
          _id: 0
        }
      }
    ])
    const total = db.viewer.find({}).count()

    res.json({
      status: 200,
      data: { browser, system, total },
      info: '访客设备信息统计成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})
// 查询访客总数
router.get('/api/front/viewer/count', async (req, res) => {
  try {
    const total = db.viewer.find({}).count()
    const doc = db.viewer.find({}).sort({ _id: -1 }).limit(1)
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
