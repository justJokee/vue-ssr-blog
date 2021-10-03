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
  original: 'boolean',
  title: 'string',
  abstract: 'string',
  content: 'string',
  publish: 'boolean',
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
const newMsgSchema = new mongoose.Schema({
  type: 'string',
  name: 'string',
  say: 'string',
  title: 'string',
  content: 'string',
  ip: 'string',
  date: 'date'
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
  newMsgSchema,
  counterSchema
}
