import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
// import loginGithub from '@/components/base/loginGithub'
// const home = resolve => require(['@/components/home/home'], resolve)
// const article = resolve => require(['@/components/article/articleRoot'], resolve)
// const life = resolve => require(['@/components/life/life'], resolve)
// const msgboard = resolve => require(['@/components/messageBoard/msgboard'], resolve)
const miss = resolve => require(['@/components/base/miss'], resolve)
// const articleShow = resolve => require(['@/components/article/articleShow'], resolve)
// const techincal = resolve => require(['@/components/article/techincal'], resolve)
// const search = resolve => require(['@/components/search/search'], resolve)
// const timeLine = resolve => require(['@/components/timeLine/timeLine'], resolve)

const home = () => import('@/views/home/')
const articleDetail = () => import('@/views/article/articleDetail')
const messageBoard = () => import('@/views/messageBoard/')

Vue.use(Router)
Vue.use(Meta)
// 避免重复点击相同路由 报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '*',
        name: 'miss',
        component: miss
      },
      {
        path: '/',
        name: 'home',
        component: home
      },
      {
        path: '/app/article/:id',
        name: 'articleDetail',
        component: articleDetail
      },
      {
        path: '/app/messageBoard',
        name: 'messageBoard',
        component: messageBoard
      }
      // {
      //   path: '/',
      //   redirect: '/app/home'
      // },
      // {
      //   path: '/app/home',
      //   component: home,
      //   name: 'home'
      // },
      // {
      //   path: '/app/article',
      //   name: 'article',
      //   component: article
      // },
      // // article的子路由
      // {
      //   path: '/app/article/:articleList',
      //   name: 'techincal',
      //   component: techincal
      // },
      // {
      //   path: '/app/article/:articleList/:id',
      //   name: 'articleShow',
      //   component: articleShow
      // },
      // {
      //   path: '/app/life',
      //   name: 'life',
      //   component: life
      // },
      // {
      //   path: '/app/life/:id',
      //   name: 'lifeShow',
      //   component: articleShow
      // },
      // {
      //   path: '/app/msgboard',
      //   name: 'msgboard',
      //   component: msgboard
      // },
      // {
      //   path: '/app/search/:searchKey',
      //   name: 'search',
      //   component: search
      // },
      // {
      //   path: '/app/timeLine/:time',
      //   name: 'timeLine',
      //   component: timeLine
      // },
      // {
      //   path: '/app/login_github',
      //   name: 'loginGithub',
      //   component: loginGithub
      // }
    ],
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) return false
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  })
}
