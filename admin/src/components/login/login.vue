<template>
	<div class = "login">
		<div class = "form-content">
			<div class = "input">
				<label for = "i">用户名 ：</label>
				<div class = "input-box">
					<input type="text" id = "i" v-model = "user" @focus = "clearErr" placeholder = "请输入用户名">
					<span class = "err">{{ err.user }}</span>
				</div>
			</div>
			<div class = "pwd">
				<label for = "p">密码 ：</label>
				<div class = "input-box">
					<input type = "password" id = "p" v-model = "password" @keydown.enter = "validate(toPath) " @focus = "clearErr" placeholder = "请输入密码">
					<span class = "err">{{ err.password }}</span>
					<span class = "err">{{ err.validate }}</span>
				</div>
			</div>
			<div class = "submit">
				<button :disabled = "btnInfo.disabled" @click = "validate(toPath)">{{ btnInfo.text }}</button>
			</div>
		</div>
		<div class = "login-mask"></div>
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
	export default {
		data(){
			return {
				user: "",
				password: "",
				err: {user: "",password: "",validate: ""},
				btnInfo: {text: "登录",disabled: false}
			}
		},
		computed: {
			...mapState(["toPath"])
		},
		methods: {
			...mapActions(["login"]),
			setToken: function(user){
				localStorage.setItem('validate-info-tk', user.token)
				localStorage.setItem("userName", user.name)
				localStorage.setItem("lastLogin", user.lastLogin)
			},
			validate: function(toPath){
				let payload = {
					user: this.user,
					password: this.password
				}
				let that = this
				if(!this.user){
					this.err.user = "请填写用户名"
				}
				if(!this.password){
					this.err.password = "请填写密码"
				}
				if(!!this.password&&!!this.user){
					this.btnInfo = {text: "登录中...",disabled: true}
					this.login(payload).then((data) => {
						that.btnInfo = {text: "登录",disabled: false}
						if(data.code === 200){
							that.setToken(data)
							that.$router.push({path: toPath})	
						}else if(data.code === 401){
							that.err.validate = "用户名或密码不正确"
						}
					})
				}
			},
			clearErr: function(){
				this.err = {user: "",password: "",validate: ""}
			}
		}
	}
</script>
<style lang = "less">
	.login{
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		background: #21282D;
		height: 100%;
		overflow: hidden;
		background: url("/img/login-bg.jpeg") 0 0 no-repeat;
		background-size: 100% 100%;
		color: #ffffff;
	}
	.err{
		color: red;
		position: absolute;
		top: 100%;
		left: 0;
		font-size: 14px;
	}
	.err-validate{
		color: red;
		font-size: 14px;
	}
	.input-box{
		display: inline-block;
		position: relative;
		width: 100%;
		flex-shrink: 1;
		margin-left: 80px;
	}
	.form-content{
		box-sizing: border-box;
		position: relative;
		z-index: 100;
		border-radius: 5px;
		padding: 20px;
		width: 40%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.input, .pwd{
		display: flex;
		align-items: center;
		margin-top: 25px;
		width: 100%;
		label{
			position: absolute;
			display: inline-block;
			width: 75px;
			text-align: right;
			font-size: 14px;
		}
		input{
			box-sizing: border-box;
			flex-shrink: 1;
			width: 100%;
			outline: none;
			padding: 10px;
			border: 1px solid #ffffff;
			border-radius: 5px;
		}
	}
	.login-mask{
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: rgba(0,0,0,.4);
	}
	.submit{
		margin-top: 25px;
		button{
			outline: none;
			padding: 5px 25px;
			border: 1px solid #46AFCB;
			border-radius: 5px;
			cursor: pointer;
			background: #46AFCB;
			color: #ffffff;
		}
		button:hover{
			opacity: 0.9;
		}
		button[disabled]{
			cursor: wait;
		}
	}
	@media screen and(max-width: 767px){
		.form-content{
			width: 100%;
		}
	}
</style>