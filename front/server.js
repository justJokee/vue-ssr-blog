const express = require('express')
const path = require('path')
const LRU = require('lru-cache')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ueditor = require('ueditor')
const logger = require('morgan')
const route = require('./server/api/')
const compression = require('compression')
const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const isProd = process.env.NODE_ENV === 'production'
const server = express()
server.use(logger('dev')) //日志记录中间件，将请求信息打印在控制台
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

//引入ejs模板引擎
server.set('views', path.join(__dirname, 'dist'))
server.engine('.html', require('ejs').__express)
server.set('view engine', 'ejs')
route(server)
function createRenderer(bundle, options) {
  return createBundleRenderer(
    bundle,
    Object.assign(options, {
      template: template,
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      basedir: resolve('./dist'),
      runInNewContext: false
    })
  )
}
let renderer
// eslint-disable-next-line no-unused-vars
let readyPromise
if (isProd) {
  const bundle = require('./dist/front/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/front/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  readyPromise = require('./build/setup-dev-server')(server, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}
readyPromise.then(() => {
  const serve = (path, cache) =>
    express.static(resolve(path), {
      maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
    })

  server.use(compression()) //开启gzip压缩
  server.use('/dist', serve('./dist', true))
  server.use('/static', serve('./src/static', true))
  server.use(express.static(path.join(__dirname, 'static'))) //设置静态文件夹
  server.use(
    '/api/ueditor/UE',
    ueditor(path.join(__dirname, 'static'), function(req, res, next) {
      //客户端上传文件设置
      let imgDir = '/img/upload'
      let ActionType = req.query.action
      if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        let file_url = imgDir //默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
          file_url = '/file/' //附件
        }
        if (ActionType === 'uploadvideo') {
          file_url = '/video/' //视频
        }
        res.ue_up(file_url) //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html')
      }
      //  客户端发起图片列表请求
      else if (req.query.action === 'listimage') {
        let dir_url = imgDir
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
      }
      // 客户端发起其它请求
      else {
        res.setHeader('Content-Type', 'application/json')
        res.redirect('/ueditor/nodejs/config.json')
      }
    })
  )
  //前端请求 TODO: '/login_qq'处理
  server.get(['/', '/app/*'], (req, res) => {
    const context = {
      title: 'mapBlog',
      url: req.url
    }
    renderer.renderToString(context, (err, html) => {
      const { title, meta } = context.meta.inject()
      if (err) {
        res.status(500).end('Internal Server Error')
        return
      }
      html = html.replace(/<title.*?<\/title>/g, title.text())
      html = html.replace(/<meta\s+.*?name="description".*?>/g, meta.text())
      res.end(html)
    })
  })
  //后端请求
  server.get(['/admin', '/admin/*', '/login'], (req, res) => {
    res.render('admin.html', { title: '登录' })
  })
  server.get('*', function(req, res) {
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
