<template>
	<div class = "admin-set">
		<div class = "revise-key">
			<h3>修改密码</h3>
			<div class = "old-key">
				<label for = "old_key">原密码：</label>
				<div class = "input-warning-box">
					<input type = "password" @focus = "warning.oldKey = ''" :class = "{'warning-border': !!warning.oldKey.length}" id = "old_key" placeholder="请输入旧密码" v-model = "key.old">
					<div class = "key-warning">{{ warning.oldKey }}</div>
				</div>
			</div>
			<div class = "new-key-first">
				<label for = "new_key_f">新密码：</label>
				<div class = "input-warning-box">
					<input :class = "{'warning-border': !!warning.newKeyFirst.length}" @focus = "warning.newKeyFirst = ''" type = "password" id = "new_key_f" placeholder="请输入新密码" v-model = "key.newFirst">
					<div class = "key-warning">{{ warning.newKeyFirst }}</div>
				</div>
			</div>
			<div class = "new-key-second">
				<label for = "new_key_s">新密码：</label>
				<div class = "input-warning-box">
					<input type = "password" @focus = "warning.newKeySecond = ''" :class = "{'warning-border': !!warning.newKeySecond.length}" id = "new_key_s" placeholder = "请再次输入新密码" v-model = "key.newSecond">
					<div class = "key-warning">{{ warning.newKeySecond }}</div>
					<div class = "submit-adminset">
						<button @click = "submit" :disabled = "waitInfo.revise === '修改中...'">{{ waitInfo.revise }}</button>
					</div>
				</div>
			</div>
		</div>
		<div class = "db-copy">
			<h3>数据库备份</h3>
			<button @click = "startCopy" :disabled = "waitInfo.copy === '备份中...'">{{ waitInfo.copy }}</button>
			<a href = "javascript: void(0)" @click = "download" v-show = "showDownload">下载到本地</a>
			<!-- <button @click = "download">下载</button> -->
		</div>
		<transition name = "set-mask">
			<div class = "adminset-mask" v-show = "adminSetMask.show">
				<div class = "adminset-mask-box">
					<h3>{{ adminSetMask.info }}</h3>
					<button @click = "adminSetMask.show = false">确认</button>
				</div>
			</div>
		</transition>	
	</div>
</template>
<script>
	import { mapActions } from "vuex"
	export default{
		data(){
			return {
				key: {old: "",newFirst: "",newSecond: ""},
				warning: {oldKey: "",newKeyFirst: "",newKeySecond: ""},
				waitInfo: {revise: "确认修改",copy: "备份"},
				adminSetMask: {show : false,info: ""},
				showDownload: false
			}
		},
		beforeRouteEnter(to,from,next){
			document.title = "后台管理 -账户设置"
			next()
		},
		methods: {
			...mapActions(["reviseKey","copyData","downloadDb"]),
			submit: function(){
				this.warning = {oldKey: "",newKeyFirst: "",newKeySecond: ""}
				if(this.key.old.length === 0){
					this.warning.oldKey = "请填写旧密码"
					return
				}else if(this.key.newFirst.length === 0){
					this.warning.newKeyFirst = "请填写新密码"
					return
				}else if(this.key.newSecond.length === 0){
					this.warning.newKeySecond = "请再次输入新密码"
					return
				}else if(this.key.newSecond !== this.key.newFirst){
					this.warning.newKeySecond = "两次输入的密码不一致"
					return
				}else{
					let that = this
					this.waitInfo.revise = "修改中..."
					this.reviseKey({
						oldKey: this.key.old,
						newKey: this.key.newFirst
					}).then((data) =>{
						if(data.code === 200){
							that.key = {old: "",newFirst: "",newSecond: ""}
							that.waitInfo.revise = "确认修改"
							that.adminSetMask = {show: true,info : "修改成功！"}
						}else if(data.code === "oldkey-401"){
							that.warning.oldKey = "原密码不正确"
							that.waitInfo.revise = "确认修改"
						}
					})
				}
			},
			startCopy: function(){
				let that = this
				this.waitInfo.copy = "备份中..."
				this.copyData().then((data) =>{
					if(data.code === 200){
						that.waitInfo.copy = "备份"
						that.adminSetMask = {show: true, info: "备份成功！"}
						that.showDownload = true
					}else{
						that.adminSetMask = {show: true, info: "备份失败！"}
					}
				})	
			},
			download: function(){
				// this.downloadDb()
				let a = document.createElement("a")
				let token = localStorage.getItem("map_blog_token_info_item_name")
				// a.href = "http://localhost: 8080/api/downloadDb?authToken=" + token
				a.href = "https://www.mapblog.cn/api/downloadDb?authToken=" + token
				a.click()
			}
		}
	}
</script>
<style lang = "less" scoped>
.revise-key{
	h3{
		text-align: center;
	}
	label{
		color: #606266;
	}
	input{
		box-sizing: border-box;
		width: 100%;
		padding: 10px 5px;
		border: 1px solid #dcdfe6;
		border-radius: 5px;
	}
	input:focus{
		border: 1px solid #46b8da;
	}
}
.old-key,.new-key-first,.new-key-second{
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 25px 0;
}
.input-warning-box{
	position: relative;
	width: 50%;
	flex-shrink: 1;
}
.warning-border{
	border: 1px solid red!important;
}
.key-warning{
	color: red;
	position: absolute;
	top: 100%;
}
.submit-adminset{
	button{
		position: absolute;
		right: 0;
		top: 60px;
		padding: 5px 10px;
		border-radius: 4px;
		background: #5bc0de;
		border: 1px solid #5bc0de;
		color: #ffffff;
		cursor: pointer;
	}
	button:hover{
		opacity: .9;
	}
	button[disabled]{
		cursor: wait
	}
}
.adminset-mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 5px;
	background: rgba(0,0,0,.5);
	button{
		padding: 5px 10px;
		border-radius: 4px;
		background: #67C23A;
		border: 1px solid #67C23A;
		color: #ffffff;
		cursor: pointer;
		margin-top: 38px;
	}
	button:hover{
		opacity: .9;
	}
}
.adminset-mask-box{
	background: #ffffff;
	width: 25%;
	border-radius: 5px;
	margin: 150px auto;
	padding: 15px;
	text-align: center;
	h3{
		margin-top: 60px;
	}
}
.db-copy{
	margin-top: 80px;
	text-align: center;
	a{
		text-decoration: none;
		color: #67C23A;
	}
	a:hover{
		text-decoration: underline;
	}
	button{
		margin-top: 50px;
		width: 25%;
		background: #409EFF;
		border: 1px solid #409EFF;
		border-radius: 5px;
		padding: 10px;
		color: #ffffff;
		cursor: pointer;
		outline: none;
	}
	button:hover{
		opacity: .9;
	}
	button[disabled]{
		cursor: wait;
	}
}
.set-mask-enter,.set-mask-leave-to{
	opacity: 0;
}
.set-mask-enter-active,.set-mask-leave-active{
	transition: all ease .5s;
}
@media screen and(max-width: 767px){
	.input-warning-box{
		width: 80%;
		flex-shrink: 1;
	}
	.adminset-mask-box{
		width: 80%;
	}
}
</style>