export default {
	pageArray(state,payload){
		let count = Math.ceil(payload/10)
		let arr = []
		for(let i = 1;i < count + 1;i++){
			arr.push(i)
		}
		state.pageArray = arr
	},
	reduceArr(state,payload){
		if(payload.name === "allArticles"){
			state.articles.all.splice(payload.index,1)
		}
		if(payload.name === "eachTag"){
			state.articles.tags.splice(payload.index,1)
		}
		if(payload.name === "draft"){
			state.articles.drafts.splice(payload.index,1)
		}
		//删除留言
		if(payload.name === "adminMsgBoard"){
			//删除一级留言
			if(payload.oneIndex !== -1 && payload.twoIndex === -1){
				state.msgBoard.splice(payload.oneIndex,1)
			//删除二级留言
			}else{
				state.msgBoard[payload.oneIndex].reply.splice(payload.twoIndex,1)
			}	
		}
		if(payload.name === "comments"){
			//删除一级留言
			if(payload.oneIndex !== -1 && payload.twoIndex === -1){
				state.comments.splice(payload.oneIndex,1)
			//删除二级留言
			}else{
				state.comments[payload.oneIndex].reply.splice(payload.twoIndex,1)
			}	
		}
	},
	reduceArr_all(state,payload){
		if(payload.name === "allArticles"){
			state.articles.all = state.articles.all.filter((item,index,arr) =>{
				return (payload.removeArr.indexOf(item.articleId) < 0)
			})
		}
		if(payload.name === "eachTag"){
			state.articles.tags = state.articles.tags.filter((item,index,arr) =>{
				return (payload.removeArr.indexOf(item.articleId) < 0)
			})
		}
		if(payload.name === "draft"){
			state.articles.drafts = state.articles.drafts.filter((item,index,arr) =>{
				return (payload.removeArr.indexOf(item.articleId) < 0)
			})
		}
		if(payload.name === "adminMsgBoard"){
			state.msgBoard = state.msgBoard.filter((item,index,arr) =>{
				return (payload.removeArr.indexOf(item._id) < 0)
			})
		}
		if(payload.name === "comments"){
			state.comments = state.comments.filter((item,index,arr) =>{
				return (payload.removeArr.indexOf(item._id) < 0)
			})
		}
	},
	addLocalWord(state,add){
		state.msgBoard.forEach((item,index,arr) =>{
			if(item._id === add._id){
				state.msgBoard.splice(index,1,add)
				return
			}
		})
	},
	addLocalComment(state,add){
		state.comments.forEach((item,index,arr) =>{
			if(item._id === add._id){
				state.comments.splice(index,1,add)
				return
			}
		})
	},
	handleNews(state,data){
		//从编辑器回退到管理主页，清除先前获取到的数据
		state.news = {pvNum: 0,comment: [],msgboard: [],like: [],pv: []}
		state.news.pvNum = data.pvNum
		data.newsArr.forEach((item,index,arr) =>{
			switch(item.type){
				case "comment": 
				state.news.comment.push(item)
				state.redSup.c = true
				break
				case "msgboard": 
				state.news.msgboard.push(item)
				state.redSup.m = true
				break
				case "like": 
				state.news.like.push(item)
				state.redSup.l = true
				break
				case "pv": 
				state.news.pv.push(item)
				state.redSup.p = true
				break
			}
		})
	},
	changeRedSup(state,type){
		switch(type){
			case "comment": 
				state.redSup.c = false
				break
				case "msgboard": 
				state.redSup.m = false
				break
				case "like": 
				state.redSup.l = false
				break
				case "pv": 
				state.redSup.p = false
				break
		}
	},
	changeCurrentPage(state,num){
		state.page = num
	},
	productView(state,article){
		state.viewArticle = article
	},
	clearOnly(state){
		state.articles.only = []
		state.forLocation = []
	},
	toPath(state,path){
		state.toPath = path
	},
	get_user(state,user){
		state.responser = user 
	}
}