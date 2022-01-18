/**
 * @desc schema
 */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user: 'string',
  password: 'string',
  lastLogin: 'string',
  salt: 'string'
})
const visitorsSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  link: 'string',
  // 0: 自定义用户 1: qq 2: github
  type: 'number',
  githubId: 'number',
  qqOpenId: 'number',
  date: 'date'
})
// 文章分类
const categorySchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  total: 'number',
  createTime: 'date',
  updateTime: 'date'
})
const articleSchema = new mongoose.Schema({
  articleId: 'number',
  categoryId: mongoose.Schema.Types.ObjectId,
  original: 'number',
  title: 'string',
  abstract: 'string',
  content: 'string',
  content_plain: 'string',
  publish: 'number',
  tag: 'array',
  commentNum: 'number',
  likeNum: 'number',
  pv: 'number',
  createTime: 'date',
  updateTime: 'date'
})
const commentSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  content: 'string',
  link: 'string',
  like: 'number',
  aite: 'string',
  articleId: 'number',
  title: 'string',
  date: 'date',
  parentId: mongoose.Schema.Types.ObjectId
})
const msgBoardSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  content: 'string',
  link: 'string',
  like: 'number',
  aite: 'string',
  parentId: mongoose.Schema.Types.ObjectId,
  date: 'date'
})
const newsSchema = new mongoose.Schema({
  type: 'string',
  // 文章评论/留言板
  name: 'string',
  ip: 'string',
  lng: 'string',
  lat: 'string',
  date: 'date',
  // 国际区域
  nation: 'string',
  // 省份
  province: 'string',
  city: 'string',
  // 区域
  district: 'string',
  // 存储 _id
  articleId: mongoose.Schema.Types.ObjectId,
  commentId: mongoose.Schema.Types.ObjectId,
  leaveMessageId: mongoose.Schema.Types.ObjectId,
  content: 'string'
})
const commentIpSchema = new mongoose.Schema({
  ip: {
    type: 'string',
    required: true
  },
  // 0: 留言 1: 文章评论 2: 文章赞
  type: {
    type: 'number',
    required: true
  },
  msgid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  like: {
    type: 'number',
    required: true
  },
  createTime: 'date',
  updateTime: 'date'
})

const counterSchema = new mongoose.Schema({
  _id: 'string',
  seq: 'number'
})

module.exports = {
  userSchema,
  visitorsSchema,
  categorySchema,
  articleSchema,
  commentSchema,
  msgBoardSchema,
  newsSchema,
  counterSchema,
  commentIpSchema
}
