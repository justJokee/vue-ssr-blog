# vue-ssr-blog-admin
![vue](https://img.shields.io/badge/vue-2.5.2-brightgreen.svg)
![vuex](https://img.shields.io/badge/vuex-3.0.1-green.svg)
![vue-router](https://img.shields.io/badge/vue--router-3.0.1-yellowgreen.svg)
![axios](https://img.shields.io/badge/axios-0.17.1-blue.svg)
> vue-ssr-blog 的后台管理项目，采用前端渲染
## 主要技术栈：
1. vue
2. vue-router
3. vuex
4. axios
5. webpack
## 必要说明：
- 详见根目录下的README说明
## 博客后台的实现功能：
- 全局响应式
- 站内文章搜索
  - 关键字搜索
  - 时间范围搜索
- 已发表文章管理
  - 所有文章
  - 按标签分类
  - 基本删改功能和文章的预览
- 草稿箱
  - 基本删改功能和文章的预览
- 留言管理
  - 预览
  - 管理员回复
  - 删除
- 文章评论管理
  - 预览
  - 管理员回复
  - 删除
- 新消息
  - 对访客的评论、留言、赞的文章以及访问的哪一篇文章进行收集分类展示
- 文本编辑器 ---Ueditor
  - 文章的发表更新
- 账户设置
  - 密码修改
  - 数据库备份及下载备份文件
- 退出管理系统
## Build Setup

``` bash
# install dependencies
npm install or cnpm install

# serve with hot reload at localhost:6180
npm run dev or npm start

# build for production with minification
npm run build
```
## 目录
```bash
|.babeirc   babel配置文件
|.editorconfig 
|.postcssrc.js
| index.html      模板文件
| package.json    webpack配置文件
| README.md
├─build       webpack配置
├─config      webpack配置
├─screenShot  README文件中的预览图
├─src
│  ├─assets
│  │  ├─css
│  │  │  └─fonts
│  │  ├─images
│  │  └─js
│  ├─components   组件文件夹
│  │  ├─adminSet
│  │  ├─article   文章管理组件
│  │  ├─base
│  │  ├─c-m-list  文章评论和留言管理列表组件
│  │  ├─comment
│  │  ├─home
│  │  ├─login
│  │  ├─msgboard
│  │  ├─news      新消息组件
│  │  ├─search    
│  │  └─ue        Ueditor编辑器组件
│  ├─router     路由
│  ├─store      vuex相关
│  │  └─api     axios封装
│  └─utils      常用工具函数
└─static        dev模式静态文件夹
    ├─css
    │  └─fonts
    ├─img
    ├─js
    └─UE        Ueditor相关配置文件
```
# 预览图
## 文章管理
![home](https://github.com/justJokee/vue-ssr-blog/raw/master/admin/screenShot/article.jpg)
## 留言管理（与评论管理基本相似）
![home](https://github.com/justJokee/vue-ssr-blog/raw/master/admin/screenShot/msgboard.jpg)
## 新消息
![home](https://github.com/justJokee/vue-ssr-blog/raw/master/admin/screenShot/news.jpg)
## 编辑器
![home](https://github.com/justJokee/vue-ssr-blog/raw/master/admin/screenShot/ueditor.jpg)
