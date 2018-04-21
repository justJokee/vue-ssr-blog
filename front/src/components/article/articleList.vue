<template>
	<div class = "articleList">
		<ul>
			<li v-for = "(item,index) in articleList" class = "article-item">
				<h2 class = "article-title">
					<a href = "javascript: void(0)" @click = "jump(item)">	{{item.title}} </a>
				</h2>
				<div class = "article-msg">
					<span class = "icon-tag-stroke"></span>
					<span class = "article-msg-tag">
						<span v-for = "tag in item.tag"> {{ tag | changeLife}} </span>
					</span>	
					<span class = "icon-clock"></span>
					<span class = "article-msg-time">{{ item.date | reviseTime}}</span>
				</div>
				<div class = "article-review">
					<div :class = "'default tag-bg-img ' + tagBg[index]"></div>
					<div class = "article-abstract"><h4>{{ item.abstract }}</h4></div>
				</div>
				<div class = "view-msg">
					<span class = "icon-eye"></span>
					<span class="pv">{{ item.pv }}</span>
					<span class = "icon-commenting-o"></span >
					<span class = "comments-num">{{ item.commentNum }}</span>
					<span class = "icon-like"></span>
					<span class = "like-num">{{ item.likeNum }}</span>
				</div>
			</li>
		</ul>
		<transition name = "fade" mode = "out-in">	
			<page v-if = "pageArr.length > 1" ></page>
	    </transition>
	</div>
</template>
<script> 	
	import { mapActions,mapState ,mapMutations } from "vuex"
	import page from "@/components/base/page"
	export default {
		components: {
			page
		},
		props: {
			articleList: {
				type: Array
			},
			page: {
				type: Array
			}
		},
		filters: {
			changeLife: function(value){
				if(value == "life"){
					return "生活"
				}else{
					return value
				}
			}
		},
		mounted(){
			Prism.highlightAll()
		},
		computed: {
			...mapState(["technicalArticles","pageArr","tagBg"])	
		},
		methods: {
			...mapMutations(["changeTitle"]),
			jump: function(item){
				this.changeTitle(item.title)
				if(item.tag[0] === "life"){
					this.$router.push({name: 'lifeShow',params : {id: item.articleId}})
				}else{
					this.$router.push({name: 'articleShow',params : {articleList: item.tag[0],id: item.articleId}})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.fade-enter-active, .fade-leave-active{
 		transition: opacity .5s
	}
	.fade-enter, .fade-leave-to{
 		opacity: 0
	}
	.articleList{
		font-size: 14px;
		line-height: 20px;
		color: #404040;
		img{
			max-width: 100%;
		}
	}
	.article-item{
		padding: 10px 10px 10px 15px;
		margin-top: 15px;
		border-radius: 3px;
		// background: #F7EDED;
		background: #FAF7F7;
		list-style: none;
		h2{
			padding: 10px 0;
			a{
				color: #16a085;
			}
		}
	}
	.article-review{
		color: #646464;
		display: flex;
		align-items: center;
		p img{
			max-width: 100%!important;
			max-height: 100%;
		}
	}
	.article-title,.article-title a{
		display: inline-block;
		transition: all ease .3s;
	}
	.article-title:hover{
		transform: translateX(10px);
	}
	.article-title:hover a{
		color: #D9A800;
		// text-decoration: underline
	}
	.article-abstract{
		margin-left: 15px;
	}
	.article-review{
		margin-top: 8px;
	}
	.article-msg{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		// color: #404040
		color: #646464;
	}
	.article-msg-tag span{
		margin: 0 2px
	}
	.article-msg-time{
		margin-left: 5px
	}
	.view-msg{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 5px;
		color: #404040
	}
	.icon-like,.icon-commenting-o,.icon-eye{
	  	margin-right: 5px;
	}
	.icon-tag-stroke{
		margin-left: 3px;
		margin-top: 2px;
	}
	.icon-clock{
		margin-left: 16px
	}
	.comments-num,.pv{
		margin-right: 14px;
	}
	.like-num{
		margin-right: 3px
	}
	.no1{
		margin-right: -4px
	}
	@media screen and(max-width: 767px){
		.article-item{
			border-radius: 0;
			margin-top: 0;
			border-top: 1px solid #ccc;
		}
	}
</style>
