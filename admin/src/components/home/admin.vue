<template>
	<div class = "admin">
		<div class = "admin-header">
			<div class = "admin-header-pic">
				<a href = "http://www.mapblog.cn/admin">
					<span class = "icon-home" title = "管理首页"></span>
				</a>
				<h1><a href = "http://www.mapblog.cn/admin">mapblog Admin</a></h1>
			</div>

			<span class = "phone-greet">{{ greet }}好，My Lord！</span>
			<div class = "admin-info">
				<img src = "/img/logo.png" style = "width: 20px;height: 20px;vertical-align: middle" alt="">
				<span>{{ greet }}好，My Lord！上次登录是：{{ lastLogin }}</span>
				<!-- <span class = "icon-exit" @click = "exit" title = "退出后台管理"></span> -->
			</div>
			<div class = "toggle-btn" @click = "showList = !showList">
				<div class = "btn-box">
					<div class = "line"></div>
					<div class = "line"></div>
					<div class = "line"></div>
				</div>
			</div>
		</div>
		<div class = "admin-body">
				<div class = "admin-list" ref = "list" :class = "{'admin-list-animation': showList}">
					<ul class = "admin-handle" @click = "showListDelay">
						<li class = "list-first"  @click.stop = "showPublish">
							<a href = "javascript: void(0)" :class = "{'router-link-active': activeBg}">
								<span class = "span-box">
									<span class = "icon-folder-outline icon-folder-outline-l" :class = "{'icon-folder-open-o icon-folder-open-o-l': show}"></span>
									<span>已发表</span>
								</span>
								<span class = "icon-keyboard_arrow_right arrow-list"  :class = "{'icon-rotate': show}"></span>
							</a>
						</li>
						<div class = "classify-menu" :class = "{'classify-menu-animation': show}">
							<ul>
								<li>
									<router-link to = "/admin/allArticles" exact>
										<div class = "eachTag-box">
											<span>
												<span class = "icon-file-text2 icon-file-text2-l"></span>
												<span>全部文章 </span>
											</span>
											<span class = "articles-sum">（共 {{ tagsObj.articlesSum | ifZero}}  篇） </span>
										</div>	
									</router-link>
								</li>
								<li v-for = "item in tagsObj.tags">
									<router-link :to = "{name: 'eachTag',params: {tag: item.tag === '生活' ?  'life' : item.tag}}">
										<div class = "eachTag-box">
											<span>
												<span class = "icon-file-text2 icon-file-text2-l"></span>
												<span>{{ item.tag }}  </span>
											</span>
											<span class = "eachTag-sum">（{{ item.num }} 篇）</span>
										</div>
									</router-link>
								</li>
							</ul>
						</div>
						<li>
							<router-link to = "/admin/draft">
								<span class = "span-box">
									<span class = "icon-quill icon-quill-l"></span>
									<span>草稿箱</span>
								</span>
							</router-link>
						</li>
						<li>
							<router-link to = "/admin/msgBoard">
								<span class = "span-box">
									<span class = "icon-messages icon-messages-l"></span>
									<span>留言板</span>
								</span>
							</router-link>
						</li>
						<li>
							<router-link to = "/admin/comments">
								<span class = "span-box">
									<span class = "icon-commenting-o icon-commenting-o-l"></span>
									<span>文章评论</span>
								</span>
							</router-link>
						</li>
						<li>
							<router-link to = "/admin/newMsg">
								<span class = "span-box span-box-news">
									<span class = "icon-bell icon-bell-l"></span>
									<sup class = "sup" v-if = "redSup.c||redSup.m||redSup.l||redSup.p"></sup>
									<span>新消息</span>
								</span>
							</router-link>
						</li>
						<li>
							<router-link to = "/admin/publish">
								<span class = "span-box">
									<span class = "icon-edit icon-edit-l"></span>
									<span>发表文章</span>
								</span>
							</router-link>
						</li>
						<li class = "list-last">
							<router-link to = "/admin/adminSet">
								<span class = "span-box">
									<span  class = "icon-user icon-user-l"></span>
									<span>账户设置</span>
								</span>
							</router-link>
						</li>
						<li>
							<a href="javascript:void(0)"  @click = "exit">
								<span class = "span-box">
									<span  class = "icon-exit icon-exit-l"></span>
									<span>退出系统</span>
								</span>
							</a>
						</li>
					</ul>
				</div>
			<div class = "admin-content" ref = "content">
				<div class = "location-search">
					<div class = "location">
						<span>当前位置：</span>
						<a href = "javascript: void(0)" @click = "$router.push({path: '/admin/allArticles'})">后台管理 </a>
						<div v-for = "item in location">
							-><a href = "javascript: void(0)"  @click = "back(item.pathName,item.params)">  {{ item.showName }} </a>
						</div>
					</div>
					<div class = "search">
						<div class = "search-key" v-show = "choseType === 'key'">
							<input  type = "text" placeholder = "请输入关键词" v-model = "searchKey" @keyup.enter = "search" >
						</div>
						<div class = "search-time" v-show = "choseType === 'time'">
							<input type = "date" @focus = "err.from = false" v-model = "date.from" :class = "{'err-border': err.from}">
							至
							<input  @focus = "err.to = false" type = "date" v-model = "date.to" :class = "{'err-border': err.to}">
						</div>
						<select name = "" id = "" v-model = "choseType">
							<option value = "key" >关键字</option>
							<option value = "time">时间</option>
						</select>
						<button @click = "search">查询</button>
					</div>
				</div>
				<keep-alive v-if = "$route.meta.keepAlive" >
    				<router-view/>
    			</keep-alive>
    			<router-view v-if = "!$route.meta.keepAlive"></router-view>
			</div>
		</div>
	</div>
</template>
<script>
	import { mapState,mapActions } from "vuex"
	export default {
		data(){
			return{
				show: false,
				location: [],	
				choseType: "key",
				searchKey: "",
				date: {from: "",to: ""},
				err: {from: false,to: false},
				lastLogin: "",
				showList: false
			}
		},
		beforeRouteUpdate(to,from,next){
			this.analysisRoute(to)
			next()
		},
		created(){
			this.analysisRoute(this.$route)
			this.getTagsclass({publish: true})
			this.getNews()
			this.lastLogined()
		},
		//离开路由则解绑事件
		beforeRouteLeave(to,from,next){
			window.removeEventListener("resize",this.listen)
			next()
		},
		filters: {
			ifZero: function(value){
				if(value > 0){
					return value
				}else{
					return 0
				}
			}
		},
		mounted(){
			window.addEventListener("resize",this.listen)
				this.initHeight()
		},
		computed: {
			...mapState(["tagsObj","news","redSup","forLocation"]),
			activeBg(){
				return !this.show && this.$route.path.indexOf("allArticles") !== -1
			},
			greet: function(){
	            let hour = new Date().getHours()
	            if(hour >= 0 && hour < 6){
	                return "凌晨"
	            }
	            if(hour >= 6 && hour < 11){
	                return "上午"
	            }
	            if(hour >= 11 && hour < 14){
	                return "中午"
	            }
	            if(hour >= 14 && hour < 18){
	                return "下午"
	            }
	            if(hour >= 18 && hour < 24){
	                return "晚上"
	            }
        	}
		},
		watch: {
			forLocation(){
				if(this.forLocation.length){
					this.location = this.forLocation
				}
			}
		},
		methods: {
			...mapActions(["getNews","getTagsclass"]),
			//不管什么情况下都把list高度设为首屏高度
			initHeight: function(){
				if(this.$route.name === "publish"){
					return
				}else{
					if(document.body.clientWidth > 767){
						this.$refs.list.style.minHeight = document.body.clientHeight - 55 + "px"
					}else{
						this.$refs.list.style = ""
					}
				}
			},
			//函数去抖，避免频繁触发拖垮浏览器
			debounce: function(func,delay){
				let context = this,
		       		args = arguments
				if(document.body.clientWidth < 768){
					this.$refs.list.style = ""
				}
		        if(this.timer){
		          	clearTimeout(this.timer)
		        }   
		        this.timer = setTimeout(function(){
		          	func.apply(context,args)
		        },delay)
		    },
		    listen: function(){
		    	this.debounce(this.initHeight,500)
		    },
			exit: function(){
				localStorage.removeItem("map_blog_token_info_item_name")
				localStorage.removeItem("userName")
				localStorage.removeItem("lastLogin")
				this.$router.push({name: "login"})
			},
			showPublish: function(){
				this.show = !this.show
			},
			search: function(){
				if(this.choseType === "key"){
					if(!this.searchKey.length){
						return
					}
					this.$router.push({name: "search",params: {base: this.searchKey}})
				}else{
					if(!this.date.from){
					this.err.from = true
					}
					if(!this.date.to){
						this.err.to = true
						return
					}
					let date = this.date.from + "to" + this.date.to
					this.$router.push({name: "search",params: {base: date}})
				}	
			},
			back: function(pathName,params){
				if(pathName === "eachTag"){
					this.$router.push({name: pathName,params: {tag: params.tag}})
				}else if(pathName === "review"){
					this.$router.push({name: pathName,params: {eTag: params.tag,articleTitle: params.title}})
				}else{
					this.$router.push({name: pathName})
				}
			},
			lastLogined: function(){
				if(localStorage.getItem("lastLogin")){
					this.lastLogin = localStorage.getItem("lastLogin")
				}
			},
			showListDelay: function(){
				setTimeout(() =>{
					this.showList = !this.showList
				},350)
			},
			analysisRoute: function(to,from){
				let first = {pathName: "allArticles",showName: "已发表文章"}
				switch(to.name){
					case "allArticles": 
					this.location = [first]
					break
					case "eachTag": 
					let tag = to.params.tag
					if(tag === "life"){
						tag = "生活"
					}
					this.location = [first,{pathName: "eachTag",showName: tag,params: {tag: tag}}]
					break
					case "review": 
						this.location = this.forLocation

					break
					case "draft": 
					this.location = [{pathName: "draft",showName: "草稿箱"}]
					break
					case "adminMsgBoard": 
					this.location = [{pathName: "adminMsgBoard",showName: "留言板"}]
					break
					case "comments": 
					this.location = [{pathName: "comments",showName: "文章评论"}]
					break
					case "newMsg": 
					this.location=[{pathName: "newMsg",showName: "新消息"}]
					break
					case "adminSet": 
					this.location=[{pathName: "adminSet",showName: "账户设置"}]
					break
					case "search" : 
					this.location = [{pathName: "search",showName: "搜索"}]
				}
			}
		}
	}
</script>
<style lang = "less">
	button,input{
		outline: none;
	}
	.admin{
		font-size: 14px;
		font-family: Arial;
	}
	.exit{
		display: flex;
		justify-content: flex-end;
		margin-right: 20px;
	}
	.admin-header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #195f88;
		height: 55px;
		overflow: hidden;
		color: #EEEEEE;
		a{
			text-decoration: none;
			color: #EEEEEE;
		}
	}
	.toggle-btn{
		display: none;
		cursor: pointer;
		float: right;
		padding: 4px;
		border: 1px solid #EEE;
		border-radius: 5px;
		margin-right: 5px;
		.btn-box{
			.line{
				height: 2px;
				width: 26px;
				border-radius: 2px;
				background: #EEE;
				margin: 4px;
			}
		}
	}
	.icon-home{
		font-size: 26px;
		vertical-align: middle;
		margin: 0 8px;
		color: #ccc;
	}
	.admin-header-pic{
		margin-left: 10px;
		a{
			display: inline-block;
		}
		img{
			width: 50px;
			height: 50px;
			vertical-align: middle;
		}
		h1{
			
			display: inline-block;
			vertical-align: middle;
		}
		h3{
			display: none;
		}
	}
	.admin-info{
		margin-right: 20px;
		span{
			vertical-align: middle;
		}
	}
	.icon-exit{
		font-size: 24px;
		cursor: pointer;
		margin-left: 15px;
		color: #ccc;
	}
	.admin-body{
		width: 100%;
		display: flex;
	}
	.location-search{
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
	}
	.location div{
		display: inline;
	}
	.admin-content{
		background: #fff;
		box-sizing: border-box;
		padding: 0 10px;
		width: 85%;
		display: inline-block;
	}
	.admin-list{
		transition: all ease 0.5s;
		width: 15%;
		background: #1C2B36;
		li{
			list-style: none;
		}
	}
	.classify-menu{
		background: #1A272E;
		overflow: hidden;
		max-height: 0;
		transition: all ease .5s;
	}
	.classify-menu-animation{
		max-height: 500px;
	}
	.admin-list>ul>li>a{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
		color: #ffffff;
		font-family: Arial;
		text-decoration: none;
		padding: 15px;
		position: relative;
	}
	.classify-menu>ul>li>a{
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #ffffff;
		font-family: Arial;
		text-decoration: none;
		padding: 15px;
		position: relative;
	}
	.eachTag-box{
		display: flex;
		min-width: 160px;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.span-box{
		min-width: 100px;
	}
	.span-box-news{
		position: relative;
	}
	.sup{
		position: absolute;
		top: 0;
		left: 20px;
		width: 6px;
		height: 6px;
		border-radius: 3px;
		background: red;
	}
	.admin-info-pic{
		display: inline-block;
		background: #EEEEEE;
		width: 70px;
		height: 70px;
		border-radius: 35px;
	}
	.notice{
		color: #444;
	}
	.list-first a{
		padding-right: 5px;
	}
	.location{
		color: #1A1A1A;
		a{
			text-decoration: none;
			color: #6AA7FC;	
		}
		a:hover{
			color: #1717FA;
		}
	}
	.search{
		padding: 5px 0;
		input{
			color: #1A1A1A;
			outline: none;
			border: 1px solid #6AA7FC;
			border-radius: 5px;
			padding: 5px;
		}
		select{
			outline: none;
			cursor: pointer;
			border: 1px solid #6AA7FC;
			border-radius: 2px;
			width: 60px;
			padding: 2px;
			appearance: none;  
			-moz-appearance: none;    /*for firefox*/       
			-webkit-appearance: none;    /*for chrome*/
			background: url("/img/arrow-down.png") right no-repeat;
		}
		button{
			background: #5bc0de;
			color: #fff;
			padding: 3px 10px;
			margin-left: 5px;
			border: 1px solid #46b8da;
			border-radius: 4px;
			outline: none;
			cursor: pointer;
		}
		button:hover{
			background: #46AFCB;
		}
	}
	.search-key{
		display: inline-block;
		input{
			width: 200px
		}
	}
	.search-time {
		display: inline-block;
		input{
			height: 15px;
			width: 150px;
		}
		input::-webkit-inner-spin-button { 
			visibility: hidden; 
		}
		input::-ms-inner-spin-button { 
			visibility: hidden; 
		}
		input::-moz-inner-spin-button { 
			visibility: hidden; 
		}
		input::-webkit-clear-button{
		   	display: none;
		}
		input::-moz-clear-button{
		   	display: none;
		}
		input::-ms-clear-button{
		   	display: none;
		}
		input::-o-clear-button{
		   	display: none;
		}
	}
	.err-border{
		border: 1px solid red!important;
	}
	.icon-folder-outline-l,.icon-quill-l,.icon-messages-l,.icon-commenting-o-l,.icon-bell-l,.icon-edit-l,.icon-user-l,.icon-file-text2-l,.icon-folder-open-o-l,.icon-bullhorn-l,.icon-exit-l{
		font-size: 16px;
		color: #fff;
		margin: 0 5px;
	}
	.arrow-list{
		position: absolute;
		right:10px;
		color: #EEE;
		font-size: 20px;
		transition: all ease .5s;
		cursor: pointer;
	}
	.icon-rotate{
		transform: rotate(90deg)
	}
	.router-link-active{
		background: #4895FC;
	}
	@media screen and(min-width: 768px){
		.phone-greet{
			display: none;
		}
		.admin-list a:hover{
			background: #0F1215;
		}
	}
	@media screen and(max-width: 767px){
		.toggle-btn{
			display: block;
		}
		.admin-header{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 100;
		}
		.admin-header-pic{
			h1{
				display: none;
			}
			h3{
				display: inline-block;
			}
		}
		.location{
			display: none;
		}
		.admin-info{
			display: none;
		}
		.admin-body{
			display: block;
			margin-top: 55px;
		}
		.admin-content{
			width: 100%;
			padding: 5px;
		}
		.admin-list{
			position: fixed;
			overflow: hidden;
			top: 55px;
			left: 0;
			width: 100%;
			max-height: 0;
			z-index: 100;
			background: rgba(28, 43, 54,0.9);
		}
		.admin-list-animation{
			max-height: 580px;
			overflow-y: scroll!important;
		}
		.classify-menu-animation{
			overflow-y: scroll!important;
			max-height: 420px;
		}
		.admin-list>ul>li>a{
			justify-content: center!important;
		}
		.classify-menu>ul>li>a{
			justify-content: center!important;
		}
		.classify-menu{
			a{
				justify-content: center;
			}
			span{
				display: inline-block;
			}
		}
	}
</style>