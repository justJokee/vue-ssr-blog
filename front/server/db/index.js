/**
 * @desc 数据库连接相关入口
 * @author justjokee
 */

const mongoose = require('mongoose')
const md5 = require('js-md5')
const { db: dbSecret, userSecret } = require('./secret')
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

// 初次启动服务后创建用户
const initUser = async () => {
  const user = await db.user.find({})

  if (!user.length) {
    const { account, pwd, salt, avatar } = userSecret
    await new db.user({
      account,
      password: md5(pwd),
      salt: salt,
      avatar,
      lastLoginTime: new Date()
    }).save()
    console.log()
    console.log('you have created account now!')
    console.log()
  }
}

// 建立连接
mongoose.Promise = global.Promise
mongoose.connection.openUri(`mongodb://${dbSecret.user}:${dbSecret.pwd}@localhost:27017/${dbSecret.db}`)
mongoose.connection.once('open', () => {
  initUser()
})

module.exports = db
