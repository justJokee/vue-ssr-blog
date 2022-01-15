#新版本更新中
# vue-ssr-blog 
[博客地址 http://www.mapblog.cn](http://www.mapblog.cn "mapblog小站")
> 这是一个完整的vue个人博客项目，包括前台页面展示和一个后台管理。<br>
> 详情请分别进入admin和front目录查看README文件

## 主目录：
```bash
│  .gitignore
│  README.md
│
├─admin  后台管理（前台渲染）
└─front  前台页面（vue-ssr服务端渲染）
```
## 在clone之前的必要说明：

- 本项目采用的是mongodb数据库，默认的数据库名称为 “blog”（修改目录：/front/server/db）*
- 数据库安全：（修改目录：/front/server/db）*
  - 用户名： “username”
  - 密码： “password”
- 后台管理登录：（修改目录：/front/server/db）
  - 初始用户名： “admin”
  - 初始密码： “12345”
- 自行修改后台管理的jsonwebtoken的密码配置文件（修改目录：/front/server/secret）
- 第三方登陆的各种clientid和secret请自行更换
  - /front/src/index.template.html
  - /front/src/components/userLogin
  - /front/server/api/visitors
- front 下所起的express服务是整个站点的服务器，负责前后台的数据交互。当然它也负责前台的开发模式热更新，通过NODE_ENV控制
- admin 下所起的服务仅供开发时的热更新和http请求转发,数据交互依靠上面所说的的front下所起的express服务器

**确保启动项目前本说明中的前两点与自己的mongodb数据库保持一致，否则项目会启动失败！！**<br>
## clone到本地
```bash
git clone git@github.com:justJokee/vue-ssr-blog.git
```
### front
```bash
cd /front
# install dependencies
npm install or cnpm install
# serve with hot reload at localhost:6180
npm run dev
# build for production
npm run build
# serve for production
npm start
```
### admin
```bash
cd /admin
# install dependencies
npm install or cnpm install
# serve with hot reload at localhost:8080
npm run dev
# build for production
npm run build
```
## 相关参考：
1. [vue-ssr官方文档](https://ssr.vuejs.org/zh/ "https://ssr.vuejs.org/zh/")<br>
2. [基于vue-ssr服务端渲染入门详解](https://juejin.im/post/5a50f208f265da3e5132ed91 "https://juejin.im/post/5a50f208f265da3e5132ed91")<br>
3. [Vue2 SSR 的优化之旅](https://segmentfault.com/a/1190000007985486 "https://segmentfault.com/a/1190000007985486")<br>
4. [vue-emoji](https://github.com/jkchao/vue-emoji "https://github.com/jkchao/vue-emoji")<br>
5. [nodejs-ueditor插件](https://github.com/netpi/ueditor "https://github.com/netpi/ueditor")<br>
...<br>
###### 感谢以上作者们的无私分享精神，让我在建立这个博客的过程中获益良多。
###### 这是我第一个开源小作品，同时也是学习Vue过程中的练手项目。代码谈不上简练美观and霸气，但希望能对刚开始学习的同学有所帮助。若本项目不小心帮到了你，不妨右上角鼓励一下【手动滑稽.jpg】
###### Ok, that's all !
