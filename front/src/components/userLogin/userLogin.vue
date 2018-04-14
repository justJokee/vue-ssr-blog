<template>
	<transition name = "mask">
		<div class = "mask" @click = "exitMask" v-show = "maskShow">	
			<transition name = "login">
				<div class = "login-box" @click.stop  v-show = "maskShow">
					<div class = "exit-login-box" @click = "exitMask">X</div>
					<div class = "self-login">
						<div class = "design-name">
							<label for = "">昵称：</label>
							<input type = "text" placeholder = "请输入昵称" v-model = "designName" @focus = "userInfoErr.name = '' ">
						</div>
						<div class = "name-info">{{userInfoErr.name}}</div>
						<div class = "email">
							<label for = "">邮箱：</label>
							<input type = "text" placeholder = "请输入邮箱" v-model = "designEmail"  @focus = "userInfoErr.email = '' ">
						</div>
						<div class = "email-info">{{userInfoErr.email}}</div>
						<div class = "register">
							<button @click = "register">注册</button>
						</div>
					</div>
					<div class = "third-login">
						<div class = "line">第三方登录</div>
						<!-- 请设置为自己的clientID -->
						<a href = "javascript: void(0)" onclick = "return window.open('https://graph.qq.com/oauth2.0/authorize?client_id=YouID&response_type=token&scope=all&redirect_uri=http://localhost:6180/qc_back.html', 'oauth2Login_10000' ,'height=525,width=585, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');" class = "login-qq">
							<img src="/img/qq.png" alt="QQ登录" >
						</a>
						<a href = "javascript: void(0)"  @click = "open" class = "login-github">
							<img src = "/img/github.png" alt = "github登录" >
						</a>
					</div>
				  	<div id = "wb_connect_btn"></div>
				</div>
			</transition>	
		</div>
	</transition>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
	export default {
		data(){
			return {
				content: "",
				userInfoErr: {name: "",email: ""},
				loginType: "",
				designName: "",
				designEmail: ""
			}
		},
		mounted(){
			if(!localStorage.getItem("map_blog_userInfo")){
				this.qq_user_info()
			}else{
				this.getLocal()
			}
		},
		computed: {
			...mapState(["userInfo","maskShow"])
		},
		methods: {
			...mapActions(["githubUser","saveUser","searchUser"]),
			...mapMutations(["set_user","handleMask"]),
			open: function(){
				this.loginType = "github"
				let that = this,
					pattern = /githubId/
				let auth = window.open("http://localhost:6180/login/git","_blank","height=600,width=800,toolbar=no, menubar=no, scrollbars=no")
				let timer = setInterval(() => {
					let cookieArr = document.cookie.split(";")
					let gitCookie = cookieArr.filter((item,index,arr) => {
						return pattern.test(item)
					})
					//检测打开的窗口是否关闭
					if(auth.closed){
						clearInterval(timer)
					}
					if(gitCookie.length){
						auth.close()
						clearInterval(timer)
						let gitId = gitCookie[0].replace(/(^\s*)|(\s*$)/,"").substring(9,gitCookie[0].length)
						that.githubUser(gitId).then((data) => {
							that.set_user({name: data[0].name,imgUrl: data[0].imgUrl,email: ""})
							that.handleMask(false)
							that.setLocal()
						})
					}	
				},500)
			},
			qq_user_info: function(){
				let that = this
				QC.Login({
       				//请求成功后的回调
				},function(oInfo,oOpts){
					that.set_user({
						name: oInfo.nickname,
						imgUrl: oInfo.figureurl_qq_1,
						email: ""
					})
					that.handleMask(false)
					that.setLocal()
				},function(){
					console.log("退出成功")
				})
			},
			register: function(){
				this.validateReg()
				let that = this
				if(!this.userInfoErr.name && !this.userInfoErr.email){
					this.searchUser({name: this.designName}).then((data) => {
						if(data.exist === "yes"){
							that.userInfoErr.name = "该用户名已存在，换一个试试？"
						}else{
							that.saveUser({
								name: that.designName,
								email: that.designEmail
							}).then((data) => {
								if(data.code === 200){
									that.set_user( {name: that.designName,imgUrl: "/img/defaultUser.jpg",email: that.designEmail})
									that.clearErr()
									that.handleMask(false)
									that.setLocal()
								}
							})
						}
					})
				}
			},
			validateReg: function(){
				let eReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/,
					nReg = /^[0-9]*$/,
					dName = this.designName,
					dEmail = this.designEmail,
					pattern = /admin|管理员|admin（管理员）/gi
				if(dName.length === 0){
					this.userInfoErr.name = "请填写用户名"
				}else if(pattern.test(dName)){
					this.userInfoErr.name = "喔唷~和管理员有点相似...换一个试试？"
				}else if(dName.length > 8){
					this.userInfoErr.name = "用户名最长8位"
				}else if(nReg.test(dName)){
					this.userInfoErr.name = "用户名不能全是数字"
				}else{
					this.userInfoErr.name = ""
				}
				if(dEmail.length === 0){
					this.userInfoErr.email = "请填写邮箱"
				}else if(!eReg.test(dEmail)){
					this.userInfoErr.email = "请填写正确的邮箱格式"
				}else{
					this.userInfoErr.email = ""
				}
			},
			exitMask: function(){
				this.handleMask(false)
				this.clearErr() 
			},
			clearErr: function(){
				this.designName = "" 
				this.designEmail = ""
				this.userInfoErr.name = "" 
				this.userInfoErr.email = "" 
			},
			getLocal: function(){
				if(localStorage.getItem("map_blog_userInfo")){
					let info = JSON.parse(localStorage.getItem("map_blog_userInfo"))
					this.set_user({
						name: info.name,
						imgUrl: info.imgUrl,
						email: info.email	
					})
				}	
			},
			setLocal: function(){
				let info = this.userInfo
				let s_info = JSON.stringify({name: info.name,imgUrl: info.imgUrl,email: info.email})
				localStorage.setItem("map_blog_userInfo",s_info)
			}
		}
	}
</script>
<style lang = "less" scoped >
	#anchor{
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
			box-shadow: 0 0 15px 0px;
		}
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
		box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
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
		box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
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
	.exit-login-box{
		position: absolute;
		top: 5px;
		right: 12px;
		cursor: pointer;
		font-size: 16px;
	}
	.login-box{
		position: relative;
		width: 380px;
		background: #fff;
		margin: 50px auto;
		padding: 20px;
		border-radius: 5px;
		transition: all .5s ease;
	}
	.login-enter-active,.login-leave-active,
	.mask-enter-active,.mask-leave-active,
	{
		transition: all .5s ease;
	}
	.login-enter,.login-leave-to{
		opacity: 0;
		transform: translateY(-400px);
	}
	.mask-enter,.mask-leave-to{
		opacity: 0;
	}
	.self-login{
		position: relative;
		padding: 10px;
		margin-top: 10px;
		label{
			font-size: 14px;
			width: 50px;
		}
		input{
			height: 24px;
			font-size: 14px;
			flex-shrink: 1; /*空间不足等比缩放*/
			width: 100%;
			border: 1px solid #ccc;
			padding: 3px;
			border-radius: 5px;
			outline: none;
		}
	}
	.design-name,.email{
		display: flex;
		display: -ms-flexbox;  
		align-items: center;
		margin-top: 20px;
		flex-shrink : 1;
	}
	.name-info,.email-info{
		position: absolute;
		left: 55px;
		font-size: 12px;
		color: red;
	}
	.register{
		display: flex;
		justify-content: flex-end;
		margin-top: 15px;
	}
	.register button,.icon-submit-box input,.dialog button{
		background: #5bc0de;
		color: #fff;
		padding: 6px 12px;
		border: 1px solid #46b8da;
		border-radius: 4px;
		outline: none;
		cursor: pointer;
	}
	.register button:hover,.icon-submit-box input:hover,.dialog button:hover{
		background: #46AFCB;
	}
	.line{
		color: #B9B9B9;
		margin: 15px 0;
		font-size: 10px;
		text-align: center;
	}
	.third-login{
		padding: 0 15px;
		text-align: center;
		a{
			display: inline-block;
			width: 50px;
			height: 50px;
			margin: 20px;
		}
		img{
			border: none;
			width: 100%;
			height: 100%;
		}
	}
	.icon-clock{
	  	margin-top: 4px;
	  	margin-right: 5px;
	}
	.icon-thumbs-o-up,.icon-thumbs-up2{
	  	display: inline-block;
	  	width: 17px;
	  	height: 17px;
	  	margin-top: 4px;
	  	margin-right: 4px;
	  	cursor: pointer;
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
		.emoji-exit{

		}
		.comment{
			padding: 20px 5px;
		}
		.reviewer-item{	
			margin: 5px;
		}
		.answer{
			margin-left: 35px;
		}
		.login-box{
			width: 90%;
			margin: 10px auto;
			padding: 10px;
		}
		.self-login{
			label{
				font-size: 12px;
			}
			input{
				font-size: 12px;
			}
		}
		.dialog{
			width: 80%;
		}
	}
</style>