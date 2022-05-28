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
  viewerSchema,
  friendLinkSchema,
  friendLinkGroupSchema
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
  viewer: mongoose.model('viewer', viewerSchema),
  friendLink: mongoose.model('friendLink', friendLinkSchema),
  friendLinkGroup: mongoose.model('friendLinkGroup', friendLinkGroupSchema)
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
// TODO: 后续会增加分类管理
const initCategorys = async () => {
  const category = await db.category.find({})

  if (!category.length) {
    await new db.category({
      name: '技术文档',
      total: 0,
      createTime: new Date()
    }).save()
    await new db.category({
      name: '生活感悟',
      total: 0,
      createTime: new Date()
    }).save()
    console.log()
    console.log('you have created category now!')
    console.log()
  }
}

// init: friendLinkGroup
const initFriendLinkGroup = async () => {
  const friendLinkGroup = await db.friendLinkGroup.find({})
  if(!friendLinkGroup.length) {
    await new db.friendLinkGroup({
      name: '小伙伴们',
      sort: 1,
      createTime: new Date()
    }).save()
    console.log()
    console.log('you have created friendLinkGroup now!')
    console.log()
  }
  // 初始化友链
  const friendLink = await db.friendLink.find({})
  if(!friendLink.length) {
    await new db.friendLink({
      siteName: 'touchFish',
      siteAvatar: 'https://imgbox.touchfish.cc/img/logo.jpg',
      siteLink: 'https://touchfish.cc/',
      siteDescribe: '远赴人间惊鸿宴，一睹人间盛世颜。',
      sort: 1,
      groupId: (await db.friendLinkGroup.findOne({name: '小伙伴们'}))._doc._id,
      status: 1, // 状态: 0: 申请中 1: 已通过 2: 未通过 -1: 已删除
      createTime: new Date()
    }).save()
    console.log()
    console.log('you have created friendLink now!')
    console.log()
  }
}

// 建立连接
mongoose.Promise = global.Promise
mongoose.connection.openUri(`mongodb://${dbSecret.user}:${dbSecret.pwd}@localhost:27017/${dbSecret.db}`)
mongoose.connection.once('open', () => {
  initUser()
  initCategorys()
  initFriendLinkGroup()
})

module.exports = db