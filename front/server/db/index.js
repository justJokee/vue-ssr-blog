const mongoose = require('mongoose')
const md5 = require('js-md5')
const dbInfo = require('./secret')
const localTime = require('../utils/reviseTime')
const {
  userSchema,
  vistorsSchema,
  articleSchema,
  commentSchema,
  msgBoardSchema,
  newMsgSchema,
  counterSchema
} = require('./schema')

mongoose.Promise = global.Promise
//请自行更改用户名和密码
// mongoose.connection.openUri("mongodb://username:password@localhost:27017/blog")
mongoose.connection.openUri(`mongodb://${dbInfo.user}:${dbInfo.pwd}@localhost:27017/${dbInfo.db}`)

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
