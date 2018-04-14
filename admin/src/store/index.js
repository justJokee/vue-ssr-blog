import Vue from "vue"
import Vuex from "vuex"
import actions from "./actions"
import mutations from "./mutations"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		articles: {all: [],drafts: [],tags: [],search: [],only: []},
		tagsObj: {},
		pageArray: [],//已发表页码数组
		msgBoard: [],
		comments: [],
		news: {pvNum: 0,comment: [],msgboard: [],like: [],pv: []},
		toPath: "/admin",
		responser: "",
		viewArticle: {},
		forLocation: [],
		page: 1,
		redSup: {c: false,m: false,l: false,p: false}
	},
	mutations,
	actions
})
export default store