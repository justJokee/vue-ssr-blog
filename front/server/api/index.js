const articles = require('./articles')
const tags = require('./tags')
const comments = require('./comments')
const msgBoard = require('./msgBoard')
const visitor = require('./visitor')
const login = require('./login')
const mongodump = require('./mongodump')
const news = require('./news')
const resetpwd = require('./resetpwd')
const category = require('./category')
const movies = require('./movies')
const qiniu = require('./qiniu')
const viewer = require('./viewer')
const count = require('./count')

module.exports = (app) => {
  app.use(viewer)
  app.use(articles)
  app.use(tags)
  app.use(comments)
  app.use(msgBoard)
  app.use(login)
  app.use(visitor)
  app.use(mongodump)
  app.use(news)
  app.use(resetpwd)
  app.use(category)
  app.use(movies)
  app.use(qiniu)
  app.use(count)
}
