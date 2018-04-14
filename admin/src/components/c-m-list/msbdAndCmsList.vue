<template>
	<div class = "msgboard-comments">
		<table class = "msgboard-comments-list" >
			<!-- 表格头部 -->
			<thead>
				<tr>
					<th>
						<div class = "chose" :class = "{'checked': ifchecked}">
							<input type = "checkbox" id = "checkAll" @click = "allChecked" v-model = "ifchecked">
							<label for = "checkAll">全选</label>
						</div>	
					</th>
					<th v-for = "th in initTable.th">{{ th }}</th>
					<th>操作</th>
				</tr>
			</thead>
			<!-- 表格主体 -->
			<tbody>
				<template  v-for = "(item,index) in mcList">
					<tr :class = "{'tr-bg' : msgItem.indexOf(item._id) !== -1 }" class = "parent-tr">
						<td>
							<div class = "chose"  :class = "{'checked': msgItem.indexOf(item._id) > -1}">
								<input :id = "'checkbox-item' + index" type = "checkbox" v-bind:value = "item._id" @click = "singleChecked" v-model = "msgItem">
								<label :for = "'checkbox-item'+index"></label>
							</div>
						</td>
						<td>{{ index+1 }}</td>
						<td v-if = "item.title" :title = item.title>{{ item.title }}</td>
						<td>{{ item.name }}</td>
						<td v-html = "item.content">{{ item.content }}</td>
						<td>{{ item.date | reviseTime }}</td>
						<td class = "some-handle">
							<span @click = "reviewBoard(index)"><span class = "icon-eye icon-eye-mc" title = "预览"></span></span>
							<span @click = "replyBoard(index,item.name)"><span class = "icon-commenting-o icon-commenting-o-mc" title = "回复"></span></span>
							<span @click = "sureDelete(item._id,-1,index,-1)"><span class = "icon-bin icon-bin-mc" title = "删除"></span></span>
						</td>
					</tr>
					<!-- 查看回复内容 -->
					<transition name = "review">
						<tr class = "msg-review" v-if = "current.review.indexOf(index) > -1">
							<td :colspan = "$route.name === 'comments' ? 7 : 6" >
								<div class = "msg-review-details">
									<span class = "arrow icon-keyboard_arrow_right" title = "收起" @click = "exitReview(index)"></span>
									<div  class = "msg-content">
										<ul>
											<li v-if = "$route.name === 'comments'"><span>文章标题：</span>{{ item.title }}</li>
											<li><span>昵称：</span>{{ item.name }}</li>
											<li>
												<span v-if = "$route.name === 'adminMsgBoard'">留言：</span>
												<span v-if = "$route.name === 'comments'">评论：</span>
												<span v-html = "item.content">{{ item.content }}</span>
											</li>
											<li><span>时间：</span>{{ item.date | reviseTime }}</li>
											<!-- 管理员的回复与其他回复 -->
											<li>
												<div><span>本条回复：</span><span v-if = "!item.reply.length">暂无</span></div>
												<table class = "admin-reply">
													<tbody >
														<tr v-for = "(rep,_index) in item.reply">
															<td :class = "{'admin-color': rep.name ==='admin（管理员）'}">{{ rep.name }} @ {{ rep.aite }}：</td>
															<td class = "" ><pre v-html = "rep.content">{{ rep.content }}</pre></td>
															<td class = "reply-time">{{ rep.date | reviseTime }}</td>
															<td>
																<!-- 管理员回复项可设置隐藏回复按钮 v-show = "rep.name !== 'King'"-->
																<span class = "icon-commenting-o icon-commenting-o-mc" @click = "replyBoard(index,rep.name)"></span>
																<span class = "icon-bin icon-bin-mc" @click = "sureDelete(item._id,rep._id,index,_index)"></span>
															</td>
														</tr>
													</tbody>
												</table>
											</li>
										</ul>
									</div>
								</div>
							</td>
						</tr>
					</transition>
					<!-- 管理员回复 -->
					<transition name = "review">	
						<tr v-if = "current.reply === index" class = "msg-reply">
							<td :colspan = "$route.name === 'comments' ? 7 : 6">
								<textarea placeholder = "输入回复内容" @focus = "emptyWarning = false" v-model = "replyContent" :class = "{'empty-warning': emptyWarning}"></textarea>
								<div class = "reply-aite-btn">
									<span>@ {{ aite }}</span>
									<!-- 回复一级留言找到_id直接push即可，二级回复也是直接push，故只需一个参数 -->
									<div>
										<button @click = "postReply(item._id)">回复</button>
										<button @click = "current.reply = -1">取消</button>
									</div>
								
								</div>
							</td>
						</tr>
					</transition>
					<!-- 管理员回复结束 -->	
				</template>
			</tbody>
		</table>
		<div class = "remove-all" v-show = "msgItem.length">
			<button @click = "sureDelete(-1)">删除选中项</button>
		</div>
		<transition name = "fade" mode = "out-in">	
			<page v-show = "pageArray.length > 1"></page>
	    </transition>
	     <transition name = "fade">
		    <div class = "validate-mask" v-show = "!!sureInfo.type.length">
		    	<div class = "validate-bin">
		    		<div class = "exit-validate"><span @click = "sureInfo.type = ''">X</span></div>
		    		<div class = "sure-deleteInfo">
		    			<h3>{{ sureInfo.warning }}</h3>
	    				<button @click = "remove">确定</button>
	    				<button @click = "sureInfo.type = ''">取消</button>
		    		</div>
		    	</div>
		    </div>
		</transition>    
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
	import page from "@/components/base/page"
	export default {
		components: {
			page
		},
		props: {
			mcList: {
				type: Array
			},
			initTable: {
				type: Object
			}
		},
		data(){
			return {
				aite: "",
				ifchecked: false,
				msgItem: [],
				deleteInfo: {oneLevelId: -1,twoLevelId: -1,oneIndex: -1,twoIndex: -1},
				sureInfo: {warning: "",type: ""},
				current: {review: [],reply: -1},
				replyContent: "",
				emptyWarning: false
			}
		},
		computed: {
			...mapState(["pageArray","page"])
		},
		watch: {
			//换页后清除所有状态
			mcList(){
				this.ifchecked = false
				this.msgItem = []
				this.currentIndex = -1
			}
		},
		methods: {
			...mapMutations(["reduceArr","reduceArr_all","addLocalWord","addLocalComment"]),
			...mapActions(["getMsgBoard","getAdminComments","addBoardReply","addCommentsReply","removeLeavewords","removeComments","reduceLeavewords","reduceComments"]),
			singleChecked: function(){
				//加定时器是因为先触发click事件，此时articleItem
				//还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
				setTimeout(() => {
					if(this.msgItem.length === this.mcList.length){ 
						this.ifchecked = true
					}else{
						this.ifchecked = false
					}
				},0)
			},
			allChecked: function(){
				if(this.msgItem.length !== this.mcList.length){
					let _arr = []
					this.mcList.forEach((item,index,arr) => { 
						_arr.push(item._id)
					})
					this.msgItem = _arr
				}else{
					this.msgItem = []
				}
			},
			reviewBoard: function(index,aite){
				this.current.review.push(index) 
			},
			exitReview: function(index){
				this.current.review.splice(this.current.review.indexOf(index),1)
			},
			replyBoard: function(index,aite){
				this.current.reply = index 
				this.aite = aite
			},
			postReply: function(id){
				let that = this
				if(!this.replyContent.length){
					this.emptyWarning = true
					return
				}
				//留言回复
				if(this.$route.name === "adminMsgBoard"){
					this.addBoardReply({
						id: id,
						name: "admin（管理员）",
						aite: this.aite,
						imgUrl: "/img/logo.png",
						content: this.replyContent,
						date: new Date()
					}).then((data) =>{
						if(data._id){
							that.addLocalWord(data)
							that.replyContent = ""
						}
					})
				}
				//评论回复
				if(this.$route.name === "comments"){
					this.addCommentsReply({
						_id: id,
						name: "admin（管理员）",
						aite: this.aite,
						imgUrl: "/img/logo.png",
						content: this.replyContent,
						like: 0,
						email: "",
						date: new Date()
					}).then((data) =>{
						if(data._id){
							that.addLocalComment(data)
							that.replyContent = ""
						}
					})
				}
			},
			sureDelete: function(mainId,secondId,oneIndex,twoIndex){
				//选中删除操作
				if(mainId === -1){
					let w = this.$route.name === "comments" ? "条评论么？" : "条留言么？"
					this.sureInfo.type = "all"
					this.sureInfo.warning = "确定删除选中的" + this.msgItem.length + w
				}else{
					let w = this.$route.name === "comments" ? "评论么？" : "留言么？"
					let info = this.deleteInfo
					this.sureInfo = {
						type: "single",
						warning: "确定删除此条" + w
					}
					this.deleteInfo = {
						oneLevelId: mainId,
						twoLevelId: secondId,
						oneIndex: oneIndex,
						twoIndex: twoIndex
					}
				}
			},
			remove: function(){
				if(this.sureInfo.type === "single"){
					this.removeSingle()
				}else{
					this.removeAll()
				}
			},
			//删除单项留言
			removeSingle: function(){
				let ol = this.deleteInfo.oneLevelId,
					tl = this.deleteInfo.twoLevelId,
					oi = this.deleteInfo.oneIndex,
					ti = this.deleteInfo.twoIndex,
					that = this
				if(this.$route.name === "adminMsgBoard"){
					//删除一级留言
					if(ol !== -1 && tl == -1){
						this.removeLeavewords({id: [ol]}).then((data) =>{
							if(data.deleteCode === 200){
								that.reduceArr({name: "adminMsgBoard",oneIndex: oi,twoIndex: ti})
								that.sureInfo.type = ""
							}
						})
					}
					//删除二级留言
					if(ol !== -1 && tl !== -1){
						this.reduceLeavewords({mainId: ol,secondId: tl}).then((data) =>{
							if(data.deleteCode === 200){
								that.reduceArr({name: "adminMsgBoard",oneIndex: oi,twoIndex: ti})
								that.sureInfo.type = ""
							}
						})
					}
				}
				//删除文章评论
				if(this.$route.name === "comments"){
					//删除一级评论
					if(ol !== -1 && tl === -1){
						this.removeComments({id: [ol]}).then((data) =>{
							if(data.deleteCode === 200){
								that.reduceArr({name: "comments",oneIndex: oi,twoIndex: ti})
								that.sureInfo.type = ""
							}
						})
					}
					//删除二级评论
					if(ol !== -1 && tl !== -1){
						this.reduceComments({mainId: ol,secondId: tl}).then((data) =>{
							if(data.deleteCode === 200){
								that.reduceArr({name: "comments",oneIndex: oi,twoIndex: ti})
								that.sureInfo.type = ""
							}
						})
					}
				}
			},
			//删除选中一级留言
			removeAll: function(){
				let that = this
				if(this.$route.name === "adminMsgBoard"){
					this.removeLeavewords({id: this.msgItem}).then((data) =>{
						if(data.deleteCode === 200){
							that.reduceArr_all({name: "adminMsgBoard",removeArr: that.msgItem})
							that.sureInfo.type = ""
						}
					})
				}
				if(this.$route.name === "comments"){
					this.removeComments({id: this.msgItem}).then((data) =>{
						if(data.deleteCode === 200){
							that.reduceArr_all({name: "comments",removeArr: that.msgItem})
							that.sureInfo.type = ""
						}
					})
				}	
			}
		}
	}
</script>
<style lang = "less" scoped>
	.msgboard-comments{
		margin-top: 25px;
	}
	.msgboard-comments-list{
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		.parent-tr{	
			color: #606266;
			border-bottom: 1px solid #ccc;
		}
		.msg-review{
				border-bottom: 1px solid #ccc;
		}
		thead tr{
			border-top: 1px solid #ccc;
			border-bottom: 1px solid #ccc;
		}
		tbody tr:nth-child(odd){
			background: #F5F7FA;
		}	
		th{
			color: #333;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			text-align: left;
			padding: 5px;
		}
		.parent-tr td{
			padding: 5px;
		}
		.parent-tr td:not(:first-child),th:not(:first-child){	
			text-align: center;
		}
		.parent-tr td:not(:last-child){
			/*border: 1px solid #aaa;*/
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		input[type="checkbox"],label{
			vertical-align: middle;
		}
	}
	.chose{
		position: relative;
		width: 12px;
		background: url("/img/checkbox.png") no-repeat;
		background-position: 0 50%;
		input{
			position: absolute;
			visibility: hidden;
		}
		label{
			padding-left: 13px;
		}
	}
	.checked{
		background-position: -16px 50%;
	}
	.msg-reply textarea{
		outline: none;
		border: 1px solid #6AA7FC;
		border-radius: 4px;
		width: 100%;
		height: 50px;
		padding: 5px;
		box-sizing: border-box;
		resize: none;
	}
	.empty-warning{
		border: 1px solid red!important;
	}
	.msg-reply td{
		padding: 8px 1px;
	}
	.reply-aite-btn{
		display: flex;
		justify-content: space-between;
		span{
			margin-left: 5px;
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
	.msg-review{
		color: #444!important;
		background: #ffffff!important;
	}
	.msg-content{
		margin-left: 30px;
		li{
			list-style: none;
			padding: 5px;
			span:first-child{
				color: orange;
			}
		}
	}
	.msg-review-details{
		position: relative;
	}
	.arrow{
		font-size: 26px;
		color: #444;
		display: inline-block;
		margin-bottom: -5px;
		transform: rotate(-90deg);
		position: absolute;
		top: 50%;
		left: -4px;
		margin-top: -13px;
		cursor: pointer;
	}
	.tr-bg{
		background: #FFF38F!important;
	}
	.validate-mask{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.5);
	}
	.validate-bin{
		margin: 50px auto 0;
		border-radius: 5px;
		width: 30%;
		height: 200px;
		background: #ffffff;
	}
	.exit-validate{
		border-radius: 5px 5px 0 0;
		background: #F7F7F7;
		text-align: right;
		padding: 5px 10px 5px 0;
		span{
			cursor: pointer;
		}
	}
	.sure-deleteInfo{
		text-align: center;
		color: #E6A23C;
		h3{
			margin-top: 60px;
		}
		button{
			outline: none;
			color: #fff;
			cursor: pointer;
			border: none;
			border-radius: 5px;
			padding: 5px 8px;
			background: #409EFF;
			margin: 50px 10px;
		}
		button:hover{
			opacity: 0.8;
		}
	}
	.remove-all{
		display: flex;
		button{
			outline: none;
			color: #fff;
			cursor: pointer;
			border: none;
			border-radius: 5px;
			padding: 5px 10px;
			background: #E6A23C;
			margin: 5px 5px 0 0;
		}
		button:hover{
			opacity: 0.9;
		}
	}
	.admin-reply{
		width: 100%;
		box-sizing: border-box;
		border-collapse: collapse;
		/*table-layout: fixed;*/
		.reply-time{
			text-align: center;
		}
		td{
			padding: 5px 0;
			background: #ffffff;
		}
		td:nth-child(1){
			width: 20%;
		}
		td:nth-child(2){
			width: 55%;
		}
		td:nth-child(3){
			width: 10%;
		}
		td:nth-child(4){
			width: 15%;
			text-align: center;
			span{
				color: #606266;
				margin: 0;
				border: none;
			}
			span.icon-commenting-o:hover{
				color: #ffffff;
			}
			span.icon-bin:hover{
				color: red;
			}
		}
	}
	.admin-color{
		color: orange;
	}
	.fade-enter-active, .fade-leave-active {
 		transition: all ease .3s
	}
	.fade-enter, .fade-leave-to {
 		opacity: 0
	}
	.review-enter-active, .review-leave-active {
 		transition: all ease .5s
	}
	.review-enter, .review-leave-to {
 		opacity: 0
	}
	.some-handle span{
		display: inline-block;
	}
	.icon-commenting-o-mc,.icon-eye-mc,.icon-bin-mc{
		font-size: 16px;
		cursor: pointer;
		padding: 5px;
		border: 1px solid #CCC;
		border-radius: 2px;
	}
	.icon-commenting-o-mc:hover,.icon-eye-mc:hover{
		color: #ffffff;
		background: #409EFF
	}
	.icon-bin-mc:hover{
		color: red;
		background: #409EFF
	}
	@media screen and(min-width: 768px){
		.icon-commenting-o-mc,.icon-eye-mc,.icon-bin-mc{
			margin-left: -5px;
		}
	}
	@media screen and(max-width: 767px){
		.validate-bin{	
			width: 80%;
		}
	}
</style>