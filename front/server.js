const express = require('express')
const path = require('path')
const lruCache = require('lru-cache')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const ejs = require('ejs')
const route = require('./server/api/')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')
const { startSchedule } = require('./server/utils/schedule')
const isProd = process.env.NODE_ENV === 'production'
const tpl = isProd ? './front/index.template.html' : './src/index.template.html'
const template = fs.readFileSync(tpl, 'utf-8')
const ratelimit = require('./server/middleware/ratelimit')
const server = express()
// nginx 反向代理后获取真实ip
logger.token('remote-addr', (req) => {
  return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
})
// const resolve = (file) => path.resolve(__dirname, file)
// 开启流控
server.use('/api', ratelimit)
// 日志记录中间件
server.use(logger(isProd ? 'combined' : 'tiny'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())
// 开启定时任务
startSchedule()
//引入ejs模板引擎
server.set('views', [path.join(__dirname, isProd ? 'front' : 'static')])
server.engine('.html', ejs.__express)
server.set('view engine', 'ejs')
route(server)

const LRU = new lruCache({
  max: 1000,
  ttl: 1000 * 60 * 15
})

function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      template: template,
      cache: LRU,
      // basedir: isProd ? resolve('./front') : resolve('./dist'),
      runInNewContext: false
    })
  )
}
let renderer
// eslint-disable-next-line no-unused-vars
let readyPromise
if (isProd) {
  const bundle = require('./front/vue-ssr-server-bundle.json')
  const clientManifest = require('./front/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
  readyPromise = Promise.resolve()
  process.env.__SAFE_PORT__ = 6180
} else {
  readyPromise = require('./build/setup-dev-server')(server, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}
readyPromise.then(() => {
  server.use(compression()) //开启gzip压缩
  // 伺服静态资源
  if (isProd) {
    server.use(express.static(path.join(__dirname, 'front')))
  } else {
    server.use(express.static(path.join(__dirname, 'static')))
  }

  // 前端请求
  server.get(['/', '/app/*'], (req, res) => {
    try {
      const context = {
        title: 'mapBlog',
        url: req.url
      }
      renderer.renderToString(context, (err, html) => {
        if (err) {
          res.status(500).end('Internal Server Error')
          return
        }
        if (context.meta) {
          const { title, meta } = context.meta.inject()
          html = html.replace(/<title.*?<\/title>/g, title.text())
          html = html.replace(/<meta\s+.*?name="description".*?>/g, meta.text())
        }

        res.end(html)
      })
    } catch (e) {
      res.status(500).end('Internal Server Error')
    }
  })

  server.get('*', function (req, res) {
    res.render('404.html', {
      title: 'No Found'
    })
  })

  const port = process.env.__SAFE_PORT__
  const uri = 'http://localhost:' + port
  // uri = 'http://127.0.0.1:' + data;
  console.log()
  console.log('启动服务路径' + uri)
  server.listen(port, '0.0.0.0')
})
