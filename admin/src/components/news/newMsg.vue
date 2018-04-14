<template>
	<div class = "newmessage">
		<div class = "newmessage-header">
			<div class = "new-comments">
				<div class = "msg-details">
					<span class = "msg-details-num">{{ news.comment.length }}</span>
					<span class = "msg-details-icon icon-commenting-o"></span>
				</div>
				<h3 class = "msg-name">新评论</h3>
			</div>
			<div class = "new-like">
				<div class = "msg-details">
					<span class = "msg-details-num">{{ news.msgboard.length }}</span>
					<span class = "msg-details-icon icon-messages"></span>
				</div>
				<h3 class = "msg-name">新留言</h3>
			</div>
			<div class = "new-leavewords">
				<div class = "msg-details">
					<span class = "msg-details-num">{{ news.like.length }}</span>
					<span class = "msg-details-icon icon-like"></span>
				</div>
				<h3 class = "msg-name">新增文章赞</h3>
			</div>
			<div class = "new-pv">
				<div class = "msg-details">
					<span class = "msg-details-num">{{ news.pvNum }}</span>
					<span class = "msg-details-icon icon-eye"></span>
				</div>
				<h3 class = "msg-name">新增文章浏览数</h3>
			</div>
		</div>
		<div class = "newmessage-body ">
			<div class = "newmessage-content">
				<div class = "newmessage-border">
					<h3>新评论一览</h3>
					<div class = "news-item">
						<ul>
							<div v-if = "!news.comment.length">暂无</div>
							<template v-for = "(item,index) in news.comment">
								<li >
									<span>{{ index+1 }}.</span>
									<span class = "news-info-box" :title = "item.content">{{ item.content }}</span>
									<span @click = "newsView(item._id)"  :class = "{'icon-rotate': currentView.indexOf(item._id) > -1}" class="icon-keyboard_arrow_right"></span>
								</li>
								<transition name = "fade" >
									<li class = "news-comment-review" v-if = "currentView.indexOf(item._id) > -1">
										<div class = "">
											<span>{{ item.name }}：</span>
											<span v-html = "item.say" >{{ item.say }}</span>
										</div>
									</li>
								</transition>	
							</template>
						</ul>
						<div class = "clear-news" v-if = "!!news.comment.length">
							<button :disabled = "dsabd.comment"  @click = "clearNews('comment')">{{ clearText.comment }}</button>
						</div>
					</div>
				</div>
			</div>
			<div class = "newmessage-content">
				<div class = "newmessage-border">
					<h3>新留言一览</h3>
					<div class = "news-item">
						<ul>
							<div v-if = "!news.msgboard.length">暂无</div>
							<template v-for = "(item,index) in news.msgboard">
								<li>
									<span>{{ index+1 }}.</span>
									<span class = "news-info-box" :title = "item.content">{{ item.content }}</span>
									<span @click = "newsView(item._id)" :class = "{'icon-rotate': currentView.indexOf(item._id) > -1}" class = "icon-keyboard_arrow_right"></span>
								</li>
								<transition name = "fade" >
									<li class = "news-msgboard-review" v-if = "currentView.indexOf(item._id) > -1">
										<div>
											<span>{{ item.name }}: </span>
											<span v-html = "item.say">{{ item.say }}</span>
										</div>
									</li>
								</transition>	
							</template>
						</ul>
						<div class = "clear-news" v-if = "!!news.msgboard.length">
							<button :disabled = "dsabd.msgboard" @click = "clearNews('msgboard')">{{ clearText.msgboard }}</button>
						</div>
					</div>
				</div>
			</div>
			<div class = "newmessage-content">
				<div class = "newmessage-border">
					<h3>新收到的赞一览</h3>
					<div class = "news-item">
						<ul>
							<div v-if = "!news.like.length">暂无</div>
							<li v-for = "(item,index) in news.like">
								<span>{{ index+1 }}.</span>
								<span class = "news-info-box" :title = "item.content">{{ item.content }}</span>
							</li>
						</ul>
						<div class = "clear-news" v-if = "!!news.like.length">
							<button :disabled = "dsabd.like" @click = "clearNews('like')">{{ clearText.like }}</button>
						</div>
					</div>
				</div>
			</div>
			<div class = "newmessage-content">
				<div class = "newmessage-border">
					<h3>新增浏览（仅显示最近15条）</h3>
					<div class = "news-item">
						<ul>
							<div v-if = "!news.pv.length">暂无</div>
							<li v-for = "(item,index) in news.pv">
								<span>{{ index+1 }}.</span>
								<span class = "news-info-box" :title = "item.content">{{ item.content }}</span>
							</li>
						</ul>
						<div class = "clear-news" v-if = "!!news.pv.length">
							<button :disabled = "dsabd.pv" @click = "clearNews('pv')">{{ clearText.pv }}</button>
						</div>
					</div>
				</div>
			</div>
		</div>	
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex" 
	export default{
		data(){
			return {
				currentView: [],
				dsabd: {comment: false,msgboard: false,like: false,pv: false},
				clearText: {comment: "设为已读",msgboard: "设为已读",like: "设为已读",pv: "设为已读"}
			}
		},
		beforeRouteEnter(to,from,next){
			document.title = "后台管理 -新消息"
			next()
		},
		computed: {
			...mapState(["news"])
		},
		methods: {
			...mapActions(["removeNews"]),
			...mapMutations(["changeRedSup"]),
			newsView(_id){
				let cr = this.currentView
				if(cr.indexOf(_id) > -1){
					this.currentView.splice(cr.indexOf(_id),1)
				}else{
					this.currentView.push(_id)
				}
			},
			clearNews(type){
				let that = this
				this.clearText[type] = "设置中..."
				this.removeNews({type: type}).then((data) =>{
					if(data.deleteCode === 200){
						that.clearText[type] = "设置已读成功"
						that.dsabd[type] = true
						that.changeRedSup(type)
					}
				})
			}	
		}
	}
</script>
<style lang = "less" scoped>
	.newmessage{
		margin-top: 15px;
	}
	.newmessage-header{
		display: flex;
	}
	.new-comments,.new-like,.new-leavewords,.new-pv{
		color: #EEE;
		width: 25%;
		margin: 0 10px;
		border-radius: 5px;
	}
	.new-comments{
		margin-left: 0;
	}
	.new-pv{
		margin-right: 0;
	}
	.msg-details-num{
		display: inline-block;
		line-height: 32px;
		font-size: 36px;
		padding: 12px 15px;
	}
	.msg-details-icon{
		font-size: 32px;
		float: right;
		padding: 5px 15px;
		color: #EEE;
	}
	.msg-name{
		padding: 5px 15px;
	}
	.new-comments{
		background: #5ECD8A;
	}
	.new-like{
		background: #F68484
	}
	.new-leavewords{
		background: #8674A6;
	}
	.new-pv{
		background: #92D1C2;
	}
	.news-info-box{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.newmessage-body{
		display: flex;
		flex-wrap: wrap;
		li{
			list-style: none;
		}
	}
	.newmessage-content{
		box-sizing: border-box;
		padding: 10px 0;
		width: 50%;
		h3{
			border-bottom: none;
			border-radius: 5px 5px 0 0;
			background: #d9edf7;
			text-align: center;
			padding: 10px 0;
		}
	}
	.newmessage-content:nth-child(odd){
		padding-right: 10px;
	}
	.newmessage-content:nth-child(even){
		padding-left: 10px;
	}
	.newmessage-border{
		width: 100%;
		height: 100%;
		border: 1px solid #bce8f1;
		border-radius: 5px 5px 0 0;
	}
	.news-item{
		padding: 5px;
		li{
			padding: 5px;
			margin: 2px 0;
			color: #fff;
			border-radius: 2px;
			position: relative;
			display: flex;
			align-items: center;
		}
	}
	.news-item .news-comment-review,.news-item .news-msgboard-review{
		padding: 5px;
		margin-top: -2px;
		border-radius: 2px;
		background: #ffffff!important;
		color: #444;
	}
	.news-comment-review{
		border: 1px solid #5ECD8A;
		border-top: none;
	}
	.news-msgboard-review{
		border: 1px solid #F68484;
		border-top: none;
	}
	.newmessage-content:nth-child(1){
		h3{
			color: #5ECD8A;
		}
		li{
			background: #5ECD8A;
		}
	}
	.newmessage-content:nth-child(2){
		h3{
			color: #F68484;
		}
		li{
			background: #F68484;
		}
	}
	.newmessage-content:nth-child(3){
		h3{
			color: #8674A6;
		}
		li{
			background: #8674A6;
		}
	}
	.newmessage-content:nth-child(4){
		h3{
			color: #92D1C2;
		}
		li{
			background: #92D1C2;
		}
	}
	.clear-news{
		display: flex;
		justify-content: flex-end;
		button{
			border: 1px solid #d9edf7;
			border-radius: 4px;
			padding: 5px;
			background: #d9edf7;
			cursor: pointer;
			color: #5ECD8A;
		}
		button:hover{
			opacity: 0.9;
		}
		button[disabled]:hover{
			cursor: not-allowed;
		}
	}
	.fade-enter,.fade-leave-to{
		opacity: 0;
	}
	.fade-enter-active,.fade-leave-active{
		transition: all ease .5s;
	}
	@media screen and(max-width: 767px){
		.newmessage-header{
			flex-wrap: wrap;
		}
		.new-comments,.new-like,.new-leavewords,.new-pv{
			width: 100%;
			margin: 5px 0;
		}
		.newmessage-content{
			width: 100%;
			padding: 5px 0!important;
		}
	}
</style>