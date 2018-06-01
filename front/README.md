# vue-ssr-blog-front
![vue](https://img.shields.io/badge/vue-2.5.13-brightgreen.svg)
![vuex](https://img.shields.io/badge/vuex-3.0.1-brightgreen.svg)
![vue-router](https://img.shields.io/badge/vue--router-3.0.1-yellowgreen.svg)
![axios](https://img.shields.io/badge/axios-0.17.1-blue.svg)
![express](https://img.shields.io/badge/express-4.16.2-green.svg)
![mongodb](https://img.shields.io/badge/mongodb-3.2.18-green.svg)
> vue-ssr-blog 的前台项目，采用服务端渲染
## 主要技术栈：
1. vue(vue-ssr)
2. vue-router
3. vuex
4. axios
5. nodejs
6. express
7. mongodb
8. mongoose
## 必要说明：
- 详见根目录下的README说明
## 博客前台的实现功能：
- 全局响应式
- 文章
  - 按标签分类展示
  - 按时间归档
- 文章分享
- 文章评论
- 留言
- 所有标签展示
- 推荐阅读浏览量前五的文章
- 支持QQ、github第三方登录
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:6180
npm run dev

# build for production with minification
npm run build
# serve for production
npm start
```
## 目录
```bash
|.babeirc   babel配置文件
|.editorconfig 
|.postcssrc.js
| index.html 
| package.json    webpack配置文件
| README.md
| server.js   最重要的express服务器文件
├─build       webpack配置
├─screenShot  存放README中的预览图
├─dist  
├─server    
│  ├─api    后端数据接口
│  ├─db     mogodb配置
│  │  ├─copyDownload    数据库备份后把待下载文件打包压缩储存到此处
│  │  └─dbData    数据库备份文件储存目录（未压缩时）
│  ├─http         后端封装的axios库
│  ├─middleware   验证token的中间件
│  ├─secret       token的密码配置文件
│  └─utils        删除文件夹等工具函数
├─src
│  ├─assets
│  │  ├─css
│  │  └─js
│  ├─components   组件文件夹
│  │  ├─article
│  │  ├─base
│  │  ├─comment
│  │  ├─home
│  │  ├─life
│  │  ├─messageBoard
│  │  ├─search
│  │  ├─tab
│  │  ├─timeLine    时间轴组件
│  │  └─vistors     访客登陆组件
│  ├─mixin
│  ├─router   路由
│  ├─store    vuex相关
│  │  └─api   前台封装的axios库
│  └─utils    一些常用的工具函数
└─static      静态文件夹
    ├─css
    │  └─fonts
    ├─img
    │  ├─banner
    │  ├─emoji
    │  └─technical
    ├─js
    └─ueditor
        └─nodejs  配置ueditor在nodejs环境下实现上传功能的插件
```
# 预览图
## 首页
![home](https://github.com/justJokee/vue-ssr-blog/raw/master/front/screenShot/home1.png)
## 技术文章导航（大于8个标签则列表显示）
![articleRoot](https://github.com/justJokee/vue-ssr-blog/raw/master/front/screenShot/articleRoot.jpg)
## 文章详情页
![article](https://github.com/justJokee/vue-ssr-blog/raw/master/front/screenShot/article1.png)
## 留言页
![msgboard](https://github.com/justJokee/vue-ssr-blog/raw/master/front/screenShot/msgboard1.png)
