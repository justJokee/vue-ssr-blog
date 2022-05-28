/**
 * @desc 友链
 * @author touchfish
 */
const express = require('express')
const router = express.Router()
const db = require('../db/')
const getIp = require('../utils/getIp')


// 获取友链列表并放入分组
router.get('/api/front/friendLink/list', async (req, res) => {
  try {
    // 获取已通过友链列表
    const friendLinkList = await db.friendLink.find({status: 1})
    const groupList = await db.friendLinkGroup.find()
    res.send({
      status: 200,
      data: {
        friendLinkList,
        groupList
      },
      total: friendLinkList.length,
      info: '获取友链列表成功'
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 申请友链接口
router.post('/api/front/friendLink/apply', async (req, res) => {
  try {
    const site = req.body
    let info = '申请友链成功,已通知博主处理~'
    let status = 200
    if(checkSite(site)) {
      // 查询该网站是否已存在
      const existSite = await db.friendLink.findOne({siteLink: site.siteLink})
      if(existSite) {
        info = '该网站已存在'
        status = 201
      } else {
        // 存储友链信息
        // 查询友链分组第一条
        const group = await db.friendLinkGroup.findOne()
        site.groupId = group._id
        site.status = 0
        site.sort = 99 // 申请的网站默认99排名靠后
        site.createTime = new Date()        
        await db.friendLink.create(site)
        // 本来打算做个多次请求禁用的 正在考虑是否有必要

        // 发送邮件    ... 没有邮件模块,又是一个坑
        // const mail = require('../mail/')
        // const mailOptions = {
        //   from: `"友链申请" <${site.email}>`,
        //   to: '' + site.email,
        //   subject: '友链申请',
        //   text: '友链申请',
        //   html: '<h1>友链申请</h1><p>' + site.name + '</p><p>' + site.link + '</p>'
        // }
        // await mail.sendMail(mailOptions)
        // 此处待开发,邮件通知博主处理
      }
    } else {
      info = '申请友链失败，请检查友链信息是否合法'
      status = 201
    }
    res.send({
      status,
      data: site,
      info
    })
  } catch (e) {
    res.status(500).end()
  }
})

// 检查友链信息是否合法
function checkSite(site) {
  for (const key in siteRules) {
    // 非空检查
    if(siteRules[key].require){
      if(!site[key]){
        return false
      }
    }
    // min
    if(siteRules[key].min){
      if(site[key].length < siteRules[key].min){
        return false
      }
    }
    // max
    if(siteRules[key].max){
      if(site[key].length > siteRules[key].max){
        return false
      }
    }
    // pattern
    if(siteRules[key].pattern){
      if(!siteRules[key].pattern.test(site[key])){
        return false
      }
    }
  }
  return true
}


const siteRules = {
  // 暂时保持现状都必填后续如果有需要可以改
  siteName: [
    {
      required: true,
      min: 2,
      max: 20,
      // 中文,英文,数字,下划线,减号,点,星号,空格,@,#,$,%,^,&,*,(,),+,_,-,=,/,\,|,{,},[,],<,>,?,:,;,'
      pattern:
        /^[\u4e00-\u9fa5a-zA-Z0-9\u4e00-\u9fa5\u0020\u0023\u0024\u0025\u005e\u0026\u002a\u0028\u0029\u002b\u005f\u003d\u002f\u007c\u007b\u007d\u005b\u005d\u003c\u003e\u003f\u003a\u003b\u0027]+$/
    }
  ],
  siteLink: [
    {
      required: true,
      // 验证a-z不包含.
      pattern:
        /^(?=^.{3,30}$)http(s)?:\/\/(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/
    }
  ],
  siteDescribe: [{ required: true, min: 1, max: 30 }],
  siteAvatar: [
    {
      required: true,
      // 验证图片链接 可能存在接口返回的情况所以直接验证网址即可
      pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#\/%=~_|]$/
    }
  ],
  messageEmail: [
    {
      required: false,
      max: 50,
      pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    }
  ]
}
module.exports = router
