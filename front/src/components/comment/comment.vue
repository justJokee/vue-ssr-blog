<template>
	<div class = "comment">
		<div id = "anchor-comment"></div>
 		<h2>说点什么：</h2>
		<div class = "say-box">
			<div v-show = "aite.length">
				<strong>回复：@</strong><span>{{ aite }}</span>
				<span @click = "aite = ''" class = "exit-aite" :title = "'取消回复' + aite" >x</span>
			</div>
			<textarea  v-model = "sayWords" @focus = "showLogin" placeholder = "这小地盘儿交给你啦 *^_^*"></textarea>
			<div class = "icon-submit-box">
				<div class = "icon-userInfo-box">
					<div @click = "emojiToggle" class = "emoji-icon">
						<img src = "/img/emoji/grinning.png" height = "20px" width = "20px" alt = "" >
					</div>
					<span class = "fence"></span>
					<div class = "reviewer-info" v-show = "!!userInfo.name">
						<img :src = userInfo.imgUrl alt = "" width = "20px" height = "20px">
						<span>{{ userInfo.name }}</span>
						<a href = "javascript: void(0)" @click = "loginOut" >退出</a>
					</div>
				</div>
				<input ref = "pubButton" type = "button" value = "发表评论" @click = "publishComment"/>
			</div>
		</div>
		<div class = "emoji-box" v-show = "emojiShow">
			<span @click = "exitEmoji" class = "emoji-exit">x</span>
			<emoji @select = "selectEmoji" ></emoji>
		</div>
		<div class="all-comments">
			<h2 >文章评论：</h2>
			<ul>
				<li v-for = "item in comments" class = "reviewer-item">
					<div class = "reviewer">
						<div class = "name-img-box">
							<div><img :src = item.imgUrl alt=""></div>
							<h3>  {{ item.name }}</h3>
						</div>
						<pre><div class = "rev-c" v-html = "item.content"></div></pre>
						<div class="rev-details">
							<span class = "icon-clock"></span>
							<span class = "rev-details-time"> {{ item.date | reviseTime}} </span>
							<a href = "#anchor-comment" class = "rev-details-reply"><span @click = "rep(item._id,item.name)"> 回复 </span></a>
							<span @click = "like(item._id)" :class = "{'icon-thumbsup': hasLiked.indexOf(item._id) !== -1,'icon-like': hasLiked.indexOf(item._id) === -1}"></span>
							<span > {{ item.like }} </span>
						</div>
					</div>
					<div class="answer" v-if = "item.reply.length > 0">
						<ul>
							<li v-for = "reply in item.reply">
								<div class = "name-img-box">
									<div><img :src = reply.imgUrl alt=""></div>
									<h3>  {{ reply.name }}: @{{ reply.aite }}</h3>
								</div>
								<pre><div class = "ans-c" v-html = "reply.content"></div></pre>
								<div class = "ans-details">
									<span class = "icon-clock"></span>
									<span class = "ans-details-time"> {{ reply.date | reviseTime}} </span>
									<a href = "#anchor-comment" class = "ans-details-reply"><span  @click = "rep(item._id,reply.name)" > 回复 </span></a>
									<span  @click = "like(item._id,reply._id)" :class = "{'icon-thumbsup': hasLiked.indexOf(reply._id) !== -1,'icon-like': hasLiked.indexOf(reply._id) === -1}"></span>
									<span> {{ reply.like }} </span>
								</div>
							</li>
						</ul>
					</div>
				</li>
				<!-- 没有评论时显示 -->
				<li class = "empty-comment" v-if = "!comments.length">
					<h3>( >﹏<。)哎~~没人理我</h3>
				</li>
			</ul>
		</div>
		<login></login>
		<transition name = "mask" v-show = "dialogErr.show">
			<div class = "mask" v-show = "dialogErr.show"  @click = "dialogErr.show = false">
				<transition name = "dialog">
					<div class = "dialog" @click.stop>
						<h1>o(╯□╰)o</h1>
						<span>{{ dialogErr.info }}</span>
						<div><button @click = "dialogErr.show = false">确定</button></div>
					</div>
				</transition>
			</div>
		</transition>
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
	import emoji from "@/components/base/emoji"
	import emojiData from "@/assets/js/emoji-data"
	import login from "@/components/userLogin/userLogin"
	export default {
		data(){
			return {
				sayWords: "",
				content: "",
				emojiShow: false,
				replyOthers: false,
				aite: "",
				loginType: "",
				_id: "",
				hasLiked: [],
				dialogErr: {show: false,info: ""}
			}
		},
		components: {
			emoji,
			login
		},
		watch: {
			$route(){
				let r = this.$route
				if(r.fullPath.indexOf("#anchor-comment") === -1){
					this.getComments({
						articleId: r.params.id,
						cache: false 	//推荐模块切换文章重新抓取评论
					}) 
				}
			}
		},
		mounted(){
			let key = "articleId_comment" + this.$route.params.id
			if(localStorage.getItem(key)){
				this.hasLiked = JSON.parse(localStorage.getItem(key))
			}
			this.getComments({
				articleId: this.$route.params.id,
				cache: false 	
			})
		},
		computed: {
			...mapState(["comments","userInfo","articles"]),
		},
		methods: {
			...mapActions(["getComments","postComment","addComment","addLike"]),
			...mapMutations(["set_user","handleMask","addLocalComments","addLocalCommentsLike"]),
			loginOut: function(){
				this.set_user({name: "",imgUrl: "",email: ""})
				this.removeLocal()
				let pattern = /githubId/
				let gitCookie = document.cookie.split(";").filter((item,index,arr) => {
					return pattern.test(item)
				})
				//清除github登陆的cookie信息
				if(gitCookie.length){
					//设置cookie的过期时间为一分钟前，让浏览器自动将其删除
					let gitId = gitCookie[0].replace(/(^\s*)|(\s*$)/,"")
					let exp = new Date(Date.now()-60*1000)//设置为一分钟前
					document.cookie = gitId + ";expires=" + exp.toUTCString()+";path=/"
				
				}else{
					QC.Login.signOut()
				}	
			},
			selectEmoji: function(emojiCode){
				this.sayWords += emojiCode
				this.emojiShow = false
			},
			publishComment: function(index){
				if(this.validatePub()){
					return
				}
				let content = this.productContent()
				let that = this
				//直接回复文章，一级评论
				if(!this.replyOthers){
					this.$refs.pubButton.value = "发表中..."
					this.postComment({
						name: this.userInfo.name,
						imgUrl: this.userInfo.imgUrl,
						email: this.userInfo.email,
						content: content,
						reply: [],
						like: 0,
						articleId: this.$route.params.id,
						title: this.articles.only[0].title,
						date: Date.now()
					}).then((data) => {
						if(data._id){
							setTimeout(() => {
								that.$refs.pubButton.value = "发表评论"
								that.sayWords = ""
								that.addLocalComments({add: data,type: 1})
							},200)
						}
					})
				//回复他人,二级评论
				}else{
					this.$refs.pubButton.value = "发表中..."
					let uif = this.userInfo
					this.addComment({
						_id: this._id,
						name: uif.name,
						imgUrl: uif.imgUrl,
						email: uif.email,
						aite: this.aite,
						content: content,
						like: 0,
						articleId: this.$route.params.id,
						date: Date.now()
					}).then((data) => {
						if(data._id){
							setTimeout(() => {
								that.$refs.pubButton.value = "发表评论"
								that.sayWords = ""
								that.aite = ""
								that.replyOthers = false
								that.addLocalComments({add: data,type: 2,_id: that._id})
							},200)
							
						}
					})
				}
			},
			validatePub: function(){
				if(!this.userInfo.name&&!this.userInfo.imgUrl){
					this.handleMask(true)
					return true
				}
				if(!this.sayWords.length){
					this.dialogErr = {show: true,info: "内容不能为空"}
					return true
				}
				if(this.sayWords.length > 500){
					this.dialogErr = {show: true,info: "内容过长，请不要超过500个字符"}
					return true
				}
			},
			productContent: function(){
				let emojiObject = {},
					finStr = this.sayWords
				finStr = finStr.replace(new RegExp("<","g"),"&lt")
				finStr = finStr.replace(new RegExp(">","g"),"&gt")
				Object.values(emojiData).forEach((item,index,arr) => {
					emojiObject = Object.assign(emojiObject,item)
				})
				Object.keys(emojiObject).forEach((item) => {
					let path = "/img/emoji/"
					let value = emojiObject[item]
					let imgURL = `<span style = "display: inline-block;vertical-align: middle"><img src=${path}${value} alt="" width = "16px" height = "16px" /></span>`
					finStr = finStr.replace(new RegExp(item,"g"),imgURL)
				})
				return finStr
			},
			emojiToggle: function(){
				this.emojiShow = !this.emojiShow
			},
			exitEmoji: function(){
				this.emojiShow = false
			},
			rep: function(_id,name){
				if(!this.userInfo.name&&!this.userInfo.imgUrl){
					this.aite = name
					this.handleMask(true)
				}else{
					this._id = _id
					this.aite = name
					this.replyOthers = true
				}
			},
			like: function(rev_id,rep_id){
				if(rep_id){
					this.handleLike(rev_id,rep_id,rep_id)
				}else{
					this.handleLike(rev_id,undefined,rev_id)
				}
			},
			handleLike: function(rev_id,rep_id,saveLocal){
				let that = this
				//点赞
				if(this.hasLiked.indexOf(saveLocal) === -1){
					this.addLike({
						revId: rev_id,
						repId: rep_id,
						addOrDel: 1
					}).then((data) => {
						that.hasLiked.push(saveLocal)
						localStorage.setItem("articleId_comment" + that.$route.params.id,JSON.stringify(that.hasLiked))
						that.addLocalCommentsLike({type: 1,rev_id: rev_id,rep_id: rep_id})
					})
				}else{
					//取消赞
					this.addLike({
						revId: rev_id,
						repId: rep_id,
						addOrDel: -1
					}).then(() => {
						that.hasLiked.splice(that.hasLiked.indexOf(saveLocal),1)
						localStorage.setItem("articleId_comment" + that.$route.params.id,JSON.stringify(that.hasLiked))
							that.addLocalCommentsLike({type: -1,rev_id: rev_id,rep_id: rep_id})
					})
				}
			},
			removeLocal: function(){
				localStorage.removeItem("map_blog_userInfo")
			},
			showLogin: function(){
				if(!this.userInfo.name&&!this.userInfo.imgUrl){
					this.handleMask(true)
				}
			}
		}	
	}
</script>
<style lang = "less" scoped >
	#anchor-comment{
		position: relative;
		top: -55px;
	}
	li{
		list-style: none
	}
	h2{
		margin-left: 10px;
	}
	.comment{
		background: #F7EDED;
		margin-top: 10px;
		padding: 20px 10px;
		border-radius: 5px;
		font-size: 14px;
		color: #404040;
		h2{
			color: #462C2C;
		} 
	}
	.say-box{
		margin: 10px 10px 5px;
		textarea{
			font-family: "STFangsong";
			resize: none;
			overflow-y: none;
			outline: none;
			font-size: 14px;
			padding: 5px;
			border: none;
			border-radius: 6px;
			box-sizing: border-box;
			width: 80%;
			height: 100px;
			box-shadow: 0 0 10px rgba(0,0,0,.4);
		}
	}
	.icon-submit-box input,.dialog button{
		background: #5bc0de;
		color: #fff;
		padding: 6px 12px;
		border: 1px solid #46b8da;
		border-radius: 4px;
		outline: none;
		cursor: pointer;
	}
	.icon-submit-box input:hover,.dialog button:hover{
		background: #46AFCB;
	}
	.exit-aite{
		margin-left: 5px;
		color: #5bc0de;
		cursor: pointer;
	}
	.emoji{
		border-radius: 5px;
	}
	.emoji-box{
		position: absolute;
		z-index: 500;
		margin-left: 10px;
		margin-top: 2px;
	}
	.emoji-exit{
		float: right;
		margin-right: 25px;
		margin-top: 15px;
		color: red;
		display: inline-block;
		cursor: pointer;
	}
	.icon-submit-box{
		width: 80%;
		margin-top: 8px;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}
	.icon-userInfo-box{
		display: flex;
		justify-content: space-between;
	}
	.reviewer-info{
		display: flex;
		align-items: center;
		margin-top: -5px;
		img{
			margin-left: 20px;
			cursor: pointer;
		}
		span,a{
			cursor: pointer;
			margin-left: 10px;
			font-size: 14px;
			color: #5bc0de;
		}
		span:hover,a:hover{
			color: #46AFCB;
		}
	}
	.emoji-icon{
		img{
			margin-top: 3px;
			cursor: pointer;
		}
	}
	.fence{
		display: inline-block;
		margin-top: 3px;
		margin-left: 5px;
		width: 2px;
		height: 20px;
		background: #D8D8D8;
	}
	.all-comments{
		margin-top: 32px;
		h2{
			margin-bottom: 20px;
			text-align: center;
		}
	}
	.reviewer{
		border: 1px solid #647155;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 0 0 10px rgba(0,0,0,0.4);
		font-family: FangSong;
	}
	.reviewer-item{	
		margin: 10px;
		pre{
			white-space: pre-wrap;
			word-wrap: break-word;
		}
	}
	.name-img-box{
		display: flex;
		align-items: center;
		img{
			border-radius: 18px;
			width: 36px;
			height: 36px;
		}
		h3{
			margin-left: 5px;
		}
	}
	.rev-c,.ans-c{
		vertical-align: middle;
		font-family: FongSong;
		font-size: 14px;
		padding: 0 10px 0 40px;
	}
	.answer{
		margin-left: 50px;
	}
	.answer li{
		border: 1px solid #647155;
		border-radius: 10px;
		padding: 10px;
		box-shadow: 2px 2px 10px rgba(0,0,0,.4);
		font-family: FangSong;
		margin-top: 10px;
	}
	.rev-details,.ans-details{
		display: flex;
		font-family: "微软雅黑";
		font-size: 12px;
		font-weight: 500;
		justify-content: flex-end;
		margin-right: 10px;
		a{
			color: #404040
		}
	}
	.rev-details-time,.rev-details-reply,.ans-details-time,.ans-details-reply{
		margin-right: 15px;
	}
	.mask{
		position: fixed;
		z-index: 1200;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5) /*用opacity会使子元素继承其透明度*/
	}
	.dialog{
		width: 30%;
		height: 200px;
		border-radius: 5px;
		text-align: center;
		box-shadow: 0 0 10px rgba(0,0,0,.6);
		background: #fff;
		margin: 150px auto;
		h1{
			font-size: 40px;
			line-height: 40px;
		}
		span{
			display: inline-block;
			margin-top: 50px;
			color: gold;
		}
		div{
			margin-top: 45px;
		}
	}
	.icon-clock{
	  	margin-top: 4px;
	  	margin-right: 5px;
	}
	.icon-like,.icon-thumbsup{
	  	display: inline-block;
	  	width: 17px;
	  	height: 17px;
	  	margin-top: 4px;
	  	margin-right: 4px;
	  	cursor: pointer;
	}

	.empty-comment{
		display: flex;
		justify-content: center;
		border-radius: 3px;
		padding: 10px;
	}
	.dialog-enter-active,.dialog-leave-active,.mask-enter-active,.mask-leave-active{
		transition: all .5s ease;
	}
	.mask-enter,.mask-leave-to,.dialog-enter,.dialog-leave-to{
		opacity: 0;
	}
	@media screen and(max-width: 767px){
		.say-box textarea{
			width: 100%;
		}
		.icon-submit-box{
			width: 100%;
		}
		.emoji-box{
			width: 92%;
		}
		.comment{
			padding: 20px 5px;
		}
		.reviewer-item{	
			margin: 10px 5px;
		}
		.answer{
			margin-left: 35px;
		}
		.dialog{
			width: 80%;
		}
	}
</style>