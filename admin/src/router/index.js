import Vue from 'vue' 
import Router from 'vue-router'
import store from "../store"
//后台管理界面
const miss = resolve => require(["@/components/base/miss"],resolve)
const login = resolve => require(["@/components/login/login"],resolve)
const admin = resolve => require(["@/components/home/admin"],resolve)
const allArticles = resolve => require(["@/components/article/allArticles"],resolve)
const eachTag = resolve => require(["@/components/article/eachTag"],resolve)
const draft = resolve => require(["@/components/article/draft"],resolve)
const review = resolve => require(["@/components/article/review"],resolve)
const initEditor = resolve => require(["@/components/ue/initEditor"],resolve)
const adminMsgBoard = resolve => require(["@/components/msgboard/adminMsgBoard"],resolve)
const comments = resolve => require(["@/components/comment/comments"],resolve)
const newMsg = resolve => require(["@/components/news/newMsg"],resolve)
const adminSet = resolve => require(["@/components/adminSet/adminSet"],resolve)
const search = resolve => require(["@/components/search/search"],resolve)

Vue.use(Router)

const router = new Router({
	mode: "history",
  routes: [
    {
      path: "*",
      name: "miss",
      component: miss
    },
    // {
    //   path: "/",
    //   redirect: "/admin"  //方便调试，生产环境删除
    // },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/admin",
      name: "admin",
      component: admin,
      redirect: "/admin/allArticles",
      meta: {
        requireAuth: true,
        keepAlive: true
      },
      children: [
        {
          path: "allArticles",
          name: "allArticles",
          component: allArticles,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "allArticles/:tag",
          name: "eachTag",
          component: eachTag,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "review/:eTag/:articleId",
          name: "review",
          component: review,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "draft",
          name: "draft",
          component: draft,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "msgBoard",
          name: "adminMsgBoard",
          component: adminMsgBoard,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "comments",
          name: "comments",
          component: comments,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "newMsg",
          name: "newMsg",
          component: newMsg,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "adminSet",
          name: "adminSet",
          component: adminSet,
          meta: {
            requireAuth: true,
            keepAlive: true
          }
        },
        {
          path: "/admin/search/:base",
          name : "search",
          component: search,
           meta: {
            requireAuth: true,
            keepAlive: true
          }
        }
      ]
    },
    //操作文章的路由
    {
      path: "/admin/publish",
      name: "publish",
      component: initEditor,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/admin/draftrevise",
      name: "draftrevise",
      component: initEditor,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/admin/update",
      name: "update",
      component: initEditor,
      meta: {
        requireAuth: true
      }
    }
  ]
})
router.beforeEach((to,from,next) => {
  //需要管理权限但是没有登录
  if(to.meta.requireAuth && !localStorage.getItem("validate-info-tk")){
    store.commit("toPath",to.fullPath)
    next({name: "login"})
    //需要管理权限且已经获取到token值则直接放行
  }else if(to.meta.requireAuth && localStorage.getItem("validate-info-tk")){
    next()
    //login界面
  }else{
    next()
  } 
})

export default router