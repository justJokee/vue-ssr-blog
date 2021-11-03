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
const vistorsSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  githubID: 'number'
})
const articleSchema = new mongoose.Schema({
  articleId: 'number',
  original: 'number',
  title: 'string',
  abstract: 'string',
  content: 'string',
  publish: 'number',
  tag: 'array',
  commentNum: 'number',
  likeNum: 'number',
  pv: 'number',
  date: 'date'
})
const commentSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  content: 'string',
  like: 'number',
  articleId: 'number',
  title: 'string',
  date: 'date'
})
const msgBoardSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  content: 'string',
  date: 'date',
  reply: [
    {
      name: 'string',
      aite: 'string',
      imgUrl: 'string',
      content: 'string',
      date: 'date'
    }
  ]
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
  articleId: 'string',
  commentId: 'string',
  leaveMessageId: 'string'
})
const counterSchema = new mongoose.Schema({
  _id: 'string',
  seq: 'number'
})

module.exports = {
  userSchema,
  vistorsSchema,
  articleSchema,
  commentSchema,
  msgBoardSchema,
  newsSchema,
  counterSchema
}
