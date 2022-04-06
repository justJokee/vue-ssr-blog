/**
 * @desc 限流中间件（简单实现）
 * @author justJokee
 */

const lruCache = require('lru-cache')
const getIp = require('../utils/getIp')
const { highLimitApis, HEIGHLIMIT, HEIGHLIMITTL } = require('../utils/highLimitApis')
// 每个ip一分钟最大限制100次请求
const LIMIT = 100
const LRU = new lruCache({
  max: 6000,
  // 默认时间窗口1分钟
  ttl: 1000 * 60
  // 过期后立即删除 Note that this may significantly degrade performance
  // ttlAutopurge: true
})

module.exports = function ratelimit(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'admin.mapblog.cn')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  const ip = getIp(req)
  const url = `${req.baseUrl}${req.url}`
  const key = `${ip}:${url}`
  const blackKey = `black:${ip}:${url}`
  const value = LRU.get(key)
  const isHeighLimitApi = highLimitApis.includes(url)
  const limit = isHeighLimitApi ? HEIGHLIMIT : LIMIT
  const option = isHeighLimitApi ? { ttl: HEIGHLIMITTL } : {}

  // cache中存在当前ip对应的接口信息
  if (value) {
    if (value < limit) {
      LRU.set(key, value + 1, option)
      next()
    }
    // 请求次数超限
    else {
      LRU.delete(key)
      LRU.set(blackKey, Date.now())
      // 返回限流状态
      response(res)
    }
  }
  // cache中不存在当前请求ip信息
  else {
    // ip已经在黑名单
    if (LRU.get(blackKey)) {
      // 返回限流状态
      response(res)
    } else {
      LRU.set(key, 1, option)
      next()
    }
  }
}

function response(res) {
  res.json({
    status: 429,
    info: '访问次数超限，请稍后再试'
  })
}
