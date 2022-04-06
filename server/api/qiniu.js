/**
 * @desc 文章分类
 * @author justJokee
 */
const express = require('express')
const router = express.Router()
const qiniu = require('qiniu')
const { qiniuConfig } = require('../db/secret')
const accessKey = qiniuConfig.AccessKey
const secretKey = qiniuConfig.SecretKey
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: qiniuConfig.Bucket
}
const confirmToken = require('../middleware/confirmToken')

// 获取分类列表
router.get('/api/front/qiniu/getToken', confirmToken, async (req, res) => {
  try {
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    res.json({
      status: 200,
      data: {
        token: uploadToken
      },
      info: '获取七牛云token成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

module.exports = router
