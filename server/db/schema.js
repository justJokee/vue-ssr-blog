/**
 * @desc DB schema
 * @author justJokee
 */
const mongoose = require('mongoose')
const { db } = require('./secret')

// 用户表
const userSchema = new mongoose.Schema({
  account: 'string',
  password: 'string',
  salt: 'string',
  avatar: 'string',
  lastLoginTime: Date
})

// 访问记录表
const viewerSchema = new mongoose.Schema({
  ip: 'string',
  count: 'number',
  browser: 'string',
  system: 'string',
  date: 'date'
})

// 自定义用户表
const visitorsSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  link: 'string',
  // 0: 自定义用户 1: qq 2: github
  type: 'number',
  githubId: 'number',
  qqOpenId: 'string',
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

// 文章表
const articleSchema = new mongoose.Schema({
  articleId: 'number',
  categoryId: mongoose.Schema.Types.ObjectId,
  original: 'number',
  title: 'string',
  abstract: 'string',
  content: 'string',
  // 当前最新编辑内容，当文档发布后，与content保持严格一致
  content_draft: 'string',
  content_plain: 'string',
  headerPic: 'string',
  // 是否发布 0：未发布 1：发布
  // 新建文档初始值为 0
  // 文档编辑阶段 可保存，可发布/更新；
  publish: 'number',
  // 是否存在未经发布的编辑内容 0：不存在（即已发布） 1：存在最新编辑内容
  editing: 'number',
  tag: 'array',
  commentNum: 'number',
  likeNum: 'number',
  pv: 'number',
  createTime: 'date',
  updateTime: 'date'
})

// 文章备注表
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
  // 是否管理员
  admin: 'number',
  parentId: mongoose.Schema.Types.ObjectId
})

// 文章点赞表
const msgBoardSchema = new mongoose.Schema({
  name: 'string',
  imgUrl: 'string',
  email: 'string',
  content: 'string',
  link: 'string',
  like: 'number',
  aite: 'string',
  parentId: mongoose.Schema.Types.ObjectId,
  // 是否管理员
  admin: 'number',
  date: 'date'
})

// 评论表
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
  // 是否已读
  read: 'number',
  // 存储 _id
  articleId: mongoose.Schema.Types.ObjectId,
  commentId: mongoose.Schema.Types.ObjectId,
  leaveMessageId: mongoose.Schema.Types.ObjectId,
  content: 'string'
})

// IP备注表
const commentIpSchema = new mongoose.Schema({
  ip: {
    type: 'string',
    required: true
  },
  // 0: 留言 1: 文章评论 2: 文章赞 3: 友链申请
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

// 计数表
const counterSchema = new mongoose.Schema({
  _id: 'string',
  seq: 'number'
})

// 友链表
const friendLinkSchema = new mongoose.Schema({
  siteName: 'string',
  siteAvatar: 'string',
  siteLink: 'string',
  siteDescribe: 'string',
  sort: 'number',
  email: 'string',
  groupId: mongoose.Schema.Types.ObjectId,
  status: 'number', // 状态: 0: 申请中 1: 已通过 2: 未通过 -1: 已删除
  createTime: 'date',
  updateTime: 'date'
})

// 友链分组
const friendLinkGroupSchema = new mongoose.Schema({
  name: 'string',
  sort: 'number',
  createTime: 'date',
  updateTime: 'date'
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
  commentIpSchema,
  viewerSchema,
  friendLinkSchema,
  friendLinkGroupSchema
}
