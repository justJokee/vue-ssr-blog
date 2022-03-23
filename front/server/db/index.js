const mongoose = require('mongoose')
const md5 = require('js-md5')
const { db: dbInfo } = require('./secret')
const localTime = require('../utils/reviseTime')
const {
  userSchema,
  visitorsSchema,
  categorySchema,
  articleSchema,
  commentSchema,
  msgBoardSchema,
  newsSchema,
  counterSchema,
  commentIpSchema,
  viewerSchema
} = require('./schema')

mongoose.Promise = global.Promise
//请自行更改用户名和密码
// mongoose.connection.openUri("mongodb://username:password@localhost:27017/blog")
mongoose.connection.openUri(`mongodb://${dbInfo.user}:${dbInfo.pwd}@localhost:27017/${dbInfo.db}`)

// 实现articleId自增序列
articleSchema.pre('save', async function (next) {
  const that = this
  try {
    const counterDoc = await db.counter.find({})
    if (!counterDoc.length) {
      await new db.counter({ _id: 'entityId', seq: 2 }).save()
      that.articleId = 1
    } else {
      const curCountDoc = await db.counter.findByIdAndUpdate(
        { _id: 'entityId' },
        {
          $inc: {
            seq: 1
          }
        }
      )
      that.articleId = curCountDoc.seq
    }
    next()
  } catch (e) {
    next(e)
  }
})

const db = {
  user: mongoose.model('user', userSchema),
  article: mongoose.model('article', articleSchema),
  category: mongoose.model('categorys', categorySchema),
  comment: mongoose.model('comment', commentSchema),
  msgBoard: mongoose.model('msgBoard', msgBoardSchema),
  visitor: mongoose.model('visitor', visitorsSchema),
  news: mongoose.model('new', newsSchema),
  counter: mongoose.model('counter', counterSchema),
  commentIp: mongoose.model('commentIp', commentIpSchema),
  viewer: mongoose.model('viewer', viewerSchema)
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
