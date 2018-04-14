import Vue from 'vue'
import Router from 'vue-router'
import Meta from "vue-meta"
import loginGithub from "@/components/base/loginGithub"
const home = resolve => require(["@/components/home/home"],resolve)
const article = resolve => require(["@/components/article/articleRoot"],resolve)
const life = resolve => require(["@/components/life/life"],resolve)
const msgboard = resolve => require(["@/components/messageBoard/msgboard"],resolve)
const miss = resolve => require(["@/components/base/miss"],resolve)
const articleShow = resolve => require(["@/components/article/articleShow"],resolve)
const techincal = resolve => require(["@/components/article/techincal"],resolve)
const search = resolve => require(["@/components/search/search"],resolve)
const timeLine = resolve => require(["@/components/timeLine/timeLine"],resolve)
 
Vue.use(Router)
Vue.use(Meta)

export function createRouter(){
    return new Router({
        mode: "history",
        routes: [
            {
                path: "*",
                name: "miss",
                component: miss
            },
            {
                path: "/",
                redirect: "/home"
            },
            {
                path: "/home",
                component: home,
                name: "home"
            },
            {
                path: "/article",
                name: "article",
                component: article
            },
              // article的子路由
            {
                path: "/article/:articleList",
                name: "techincal",
                component: techincal
            },
            {
                path: "/article/:articleList/:id",
                name: "articleShow",
                component: articleShow
            },
            {
                path: "/life",
                name: "life",
                component: life
            },
            {
                path: "/life/:id",
                name: "lifeShow",
                component: articleShow
            },
            {
                path: "/msgboard",
                name: "msgboard",
                component: msgboard
            },
            {
                path: "/search/:searchKey",
                name: "search",
                component: search
            },
            {
                path: "/timeLine/:time",
                name: "timeLine",
                component: timeLine
            },
            {
                path: "/login_github",
                name: "loginGithub",
                component: loginGithub
            }
        ]
    })
}

