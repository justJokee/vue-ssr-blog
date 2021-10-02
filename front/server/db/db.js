const mongoose = require('mongoose')
const md5 = require('js-md5')
const dbInfo = require('./secret')
const localTime = require('../utils/reviseTime')
mongoose.Promise = global.Promise
//请自行更改用户名和密码
// mongoose.connection.openUri("mongodb://username:password@localhost:27017/blog")
mongoose.connection.openUri(`mongodb://${dbInfo.user}:${dbInfo.pwd}@localhost:27017/${dbInfo.db}`)
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
  reply: [
    {
      name: 'string',
      imgUrl: 'string',
      email: 'string',
      aite: 'string',
      content: 'string',
      like: 'number',
      date: 'date'
    }
  ], //记得加上日期格式
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
//实现自增序列
articleSchema.pre('save', function(next) {
  let _this = this
  db.counter.find({}, (err, doc) => {
    if (err) {
      console.error(err)
    } else {
      if (!doc.length) {
        new db.counter({ _id: 'entityId', seq: 1 }).save()
        next()
      } else {
        db.counter.findByIdAndUpdate(
          { _id: 'entityId' },
          {
            $inc: {
              seq: 1
            }
          },
          function(error, counter) {
            if (error) {
              return next(error)
            } else {
              _this.articleId = counter.seq
              next()
            }
          }
        )
      }
    }
  })
})
const db = {
  user: mongoose.model('user', userSchema),
  article: mongoose.model('article', articleSchema),
  comment: mongoose.model('comment', commentSchema),
  msgBoard: mongoose.model('msgBoard', msgBoardSchema),
  vistor: mongoose.model('vistor', vistorsSchema),
  newMsg: mongoose.model('new', newMsgSchema),
  counter: mongoose.model('counter', counterSchema)
}
const initDbUser = () => {
  db.user.find({}, (err, doc) => {
    if (err) {
      console.error(err)
    } else {
      if (!doc.length) {
        let salt = Math.ceil(Math.random() * 10000)
        let currTime = localTime(Date.now())
        new db.user({
          user: 'admin',
          password: md5('12345' + salt),
          salt: salt,
          lastLogin: currTime
        }).save()
      } else {
        console.log('Userinit has done')
      }
    }
  })
}
mongoose.connection.once('open', () => {
  initDbUser()
})
module.exports = db
