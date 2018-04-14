const axios = require("axios")
import api from "./api"
export default {
	//获取文章
	getArticles({commit,state},payload){
		let params = {}
		if(!payload.tag){
			params = {
				publish : payload.publish,
				page : payload.page,
			}
		}else{
			params = payload
		}
		return api.get("/api/getAdminArticles",params).then((data) => {
			if(data.length){
				if(!payload.tag){
					if(payload.publish === true){
						state.articles.all = data
					}else{
						state.articles.drafts = data
					}
				}else{
					state.articles.tags = data
				}
			}	
			return data
		})
	},
	//获取技术文章的tag生成导航
	getTagsclass({commit,state},payload){
		return api.get("/api/adminTags",{publish: payload.publish}).then((data) => {
			if(data.tags&&data.tags.length){
				data.tags.forEach((item,index,arr) =>{
					if(item.tag === "life"){
						item.tag = "生活"
					}
				})
				state.tagsObj = data
			}
			return data
		})
	},
	//获取对应模块的文章总数，为分页按钮个数提供支持
	getArticlesCount({commit,state},payload){
		return api.get("/api/getCount",payload).then((data) => {
			commit("pageArray",data)
		})
	},
	//精准获取文章
	getArticle({commit,state},payload){
		return api.get("/api/getAdminArticle",payload).then((data) => {
			if(data.length){
				state.articles.only = data
				let _tag = data[0].tag[0]
				if(data[0].publish){				
					state.forLocation = [{pathName: "allArticles",showName: "已发表文章"},{pathName: "eachTag",showName: _tag,params: {tag: _tag}},{pathName: "review",showName: data[0].title,params: {eTag: _tag,articleId: data[0].articleId}}]
				}else{
					state.forLocation = [{pathName: "draft",showName: "草稿"},{pathName: "review",showName: data[0].title,params: {eTag: _tag,articleId: data[0].articleId}}]
				}
			}
			return data
		})
	},
	getMsgBoard({commit,state},payload){
		return api.get("/api/getAdminBoard",payload).then((data) => {
			if(data.length){
				state.msgBoard = data
			}
			return data
		})
	},
	getNews({commit,state},payload){
		return api.get("/api/getNews").then((data) =>{
			if(data.newsArr&&data.newsArr.length){
				commit("handleNews",data)
			}
			return data
		})
	},
	getMsgCount({commit},payload){
		return api.get("/api/getMsgCount").then((data) => {
			commit("pageArray",data)
		})
	},
	addBoardReply({commit},payload){
		return api.patch("/api/addReply",payload)
	},
	removeLeavewords({commit},payload){
		return api.delete("/api/removeLeavewords",payload)
	},
	reduceLeavewords({commit},payload){
		return api.patch("/api/reduceLeavewords",payload)
	},
	search({commmit,state},payload){
		return api.get("/api/adminSearch",payload).then((data) => {
			if(data.length){
				state.articles.search = data
			}else{
				state.articles.search = []
			}
			return data
		})
	},
	getAdminComments({commit,state},payload){
		return api.get("/api/getAdminComments",payload).then((data) => {
			if(data.length){
				state.comments = data
			}
			return data
		})
	},
	getCommentsCount({commit,state}){
		return api.get("/api/getCommentsCount").then((data) =>{
			commit("pageArray",data)
		})
	},
	addCommentsReply({commit},payload){
		return api.patch("/api/addComment",payload)
	},
	removeComments({commit},payload){
		return api.delete("/api/removeComments",payload)
	},
	reduceComments({commit},payload){
		return api.patch("/api/reduceComments",payload)
	},
	login({commit,state},payload){
		return api.post("/api/login",payload)
	},
	saveArticle({commit},payload){
		return api.post("/api/saveArticle",payload)
	},
	updateArticle({commit},payload){
		return api.patch("/api/updata",payload)
	},
	removeArticle({commit},payload){
		return api.delete("/api/deleteArticle",payload)
	},
	removeNews({commit,state},payload){
		return api.delete("/api/deleteNews",payload)
	},
	reviseKey({commit},payload){
		return api.patch("/api/reviseKey",payload)
	},
	copyData: function(){
		return api.get("/api/copyData")
	},
	downloadDb: function(){
		return api.get("/api/downloadSingle")
	},
	confirmToken: function(){
		return api.get("/api/confirmToken")
	}
}