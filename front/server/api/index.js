const articles = require('./articles')
const tags = require('./tags')
const getCount = require('./getCount')
const comments = require('./comments')
const getTime = require('./getTime')
const msgBoard = require('./msgBoard')
const visitor = require('./visitor')
const login = require('./login')
const copyData = require('./copyData')
const news = require('./news')
const reviseKey = require('./reviseKey')
const donload = require('./donload')
const category = require('./category')
const movies = require('./movies')

// const confirmToken = require('../middleware/confirmToken')

module.exports = app => {
  // app.use(confirmToken)
  app.use(articles)
  app.use(tags)
  app.use(getCount)
  app.use(comments)
  app.use(getTime)
  app.use(msgBoard)
  app.use(login)
  app.use(visitor)
  app.use(copyData)
  app.use(news)
  app.use(reviseKey)
  app.use(donload)
  app.use(category)
  app.use(movies)
}
