const express = require('express')
const path = require('path')
const lruCache = require('lru-cache')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const ejs = require('ejs')
const detect = require('detect-port')
const route = require('./server/api/')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')
const { startSchedule } = require('./server/utils/schedule')
const isProd = process.env.NODE_ENV === 'production'
const tpl = isProd ? './front/index.template.html' : './src/index.template.html'
const template = fs.readFileSync(tpl, 'utf-8')
const ratelimit = require('./server/middleware/ratelimit')
const getIp = require('./server/utils/getIp')
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
  readyPromise = new Promise((resolve) => {
    checkPort().then((port) => {
      process.env.__SAFE_PORT__ = port
      resolve()
    })
  })
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
      // 文章详情页、留言板页面请求，在server-render运行时注入客户端IP，
      // 否则在在查表时，获取的是生产环境的服务器IP，这将导致根据ip统计的点赞情况失效
      if (req.url.startsWith('/app/article/') || req.url === '/app/messageBoard') {
        context._ip = getIp(req)
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
  console.log()
  console.log('启动服务路径' + uri)
  console.log()
  server.listen(port, '0.0.0.0')
})
// 检查端口占用情况
function checkPort(port = 6180) {
  return new Promise((resolve) => {
    detect(port, (err, _port) => {
      if (err) {
        console.log(err)
      }
      if (port == _port) {
        resolve(port)
      } else {
        resolve(_port)
        console.log(`port: ${port} was occupied, try port: ${_port}`)
      }
    })
  })
}
