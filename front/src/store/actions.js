import api from "./api"
export default{
	//获取文章
	getArticles({commit,state},payload){
		let params ={}
		if(!payload.tag){
			params ={
				publish: payload.publish,
				page: payload.page,
				cache: true
			}
		}else{
			params = payload
		}
		return api.get("/api/getArticles",params).then((data) =>{
			if(!payload.tag){
				state.articles.all = data
			}else if(payload.tag === "life"){
				state.articles.life = data
			}else{
				state.articles.technical = data
			}
			commit("productBg",data)
			return data
		})
	},
	timeArticles({commit,state},payload){
		return api.get("/api/search",payload).then((data) =>{
			state.articles.time = data
			commit("productBg",data)
			return data
		})
	},
	//获取技术文章的tag生成导航
	getTagsclass({commit,state},payload){
		return api.get("/api/tags",{publish: payload.publish}).then((data) =>{
			state.tags = data
			return data
		})
	},
	//获取对应模块的文章总数，为分页按钮个数提供支持
	getArticlesCount({commit,state},payload){
		return api.get("/api/getCount",payload).then((data) =>{
			state.articles.sum = data
			commit("pageArray",data)
			return data
		})
	},
	//精准获取文章
	getArticle({commit,state},payload){
		let tag
		if(payload.tag === undefined){ //life目录下路由参数只有ID，无tag参数
			tag = "life"
		}else{
			tag = payload.tag
		}
		return api.get("/api/onlyArticle",{
			publish: payload.publish,
			tag: tag,
			articleId: payload.articleId,
			cache: true
		}).then((data) =>{
			state.articles.only = data
			if(data.length){
				return api.get("/api/preAndNext",{date: data[0].date,cache: true}).then((data1) =>{
					state.articles.pre_next = data1
				})
			}
		})
	},
	search({commit,state},payload){
		return api.get("/api/search",payload).then((data) =>{
			state.articles.search = data
			commit("productBg",data)
			return data
		})
	},
	getComments({commit,state},payload){
		return api.get("/api/getComments",payload).then((data) =>{
			state.comments = data
			return data
		})
	},
	getTime({state},payload){
		return api.get("/api/getTime",payload).then((data) =>{
			state.timeLine = data
			return data
		})
	},
	getHot({state}){
		return api.get("/api/getHot",{}).then((data) =>{
			state.articles.hot = data
			return data
		})
	},
	getLeaveWords({commit,state},payload){
		return api.get("/api/getMsgBoard",payload).then((data) =>{
			state.msgBoardArr = data
			return data
		})
	},
	getMsgCount({commit},payload){
		return api.get("/api/getMsgCount",payload).then((data) =>{
			commit("pageArray",data)
			return data
		})
	},
	preAndNext({commit,state},payload){
		return api.get("/api/preAndNext",payload).then((data) =>{
			state.articles.pre_next = data
		})
	},
	saveLeaveWords({commit},payload){
		return api.post("/api/saveLeaveW",payload)
	},
	addLeaveWords({commit},payload){
		return api.patch("/api/addReply",payload) 
	},
	postComment({commit},payload){
		return api.post("/api/saveComment",payload)
	},
	addComment({commit},payload){
		return api.patch("/api/addComment",payload)
	},
	
	loveArticle({commit},payload){
		return api.patch("/api/loveArticle",payload)
	},
	addLike({commit},payload){
		return api.patch("/api/addLike",payload)
	},
	searchUser({commit},payload){
		return api.get("/api/searchUser",payload)
	},
	saveUser({commit},payload){
		return api.post("/api/saveDesignUser",payload)
	},
	githubUser({commit},userID){
		return api.get("/api/getGithub",{
			id: userID
		})
	}
}
