<template>
	<div class = "article-review">
		<div v-for = "item in articles.only">
			<div class = "review-title"><h2>{{ item.title }}</h2></div>
			<div class = "review-tags">
				<h4>标签：</h4>
				<span v-for = "t in item.tag">{{ t }}</span>
			</div>
			<div class = "review-abstract">
				<h4>前言：</h4>
				<span>{{ item.abstract }}</span> 
			</div>
			<div class = "review-content" v-html = "item.content">{{ item.content }}</div>
		</div>
	</div>
</template>
<script>
	import { mapState,mapActions,mapMutations } from "vuex"
	export default{
		beforeRouteLeave(to,from,next){
			this.clearOnly()
			next()
		},
		created(){
			this.getOnlyArticle()
			document.title = "后台管理 -文章预览"
		},
		watch: {
			$route(){
				if(this.$route.name === "review"){
					this.getOnlyArticle()
				}
			}
		},
		computed: {
			...mapState(["articles"])
		},
		methods: {
			...mapActions(["getArticle"]),
			...mapMutations(["clearOnly"]),
			getOnlyArticle: function(){
				this.getArticle({
					tag: this.$route.params.eTag,
					articleId: this.$route.params.articleId
				}).then((data) =>{
					this.$nextTick(function(){
		                Prism.highlightAll()
		            })
				})
			}
		}
	}
</script>
<style lang = "less">
	.article-review{
		box-sizing: border-box;
		padding: 20px;
		color: #404040;
		line-height: 1.8;
		width: 80%;
		margin: 20px auto 0;
		box-shadow: 0 0 1px rgba(0,0,0,0.8);
		border-radius: 2px;
	}
	.review-tags{
		h4{
			display: inline-block;
		}
		span{
			margin-right: 10px;
		}
	}
	.review-abstract,.review-content{
		margin-top: 10px;
	}
	.review-abstract h4{
		display: inline-block;
	}
	.review-title{
		margin-top: 10px;
		text-align: center;
	}
	.review-content {
		li{
			margin-left: 15px;
		}
		hr{
			margin: 15px 0;
			height: 0;
			border: 0;
			border-top: 1px solid #ccc;
		}
	}
	@media screen and(max-width: 767px){
		.article-review{
			margin-top: 10px;
			padding: 10px;
			width: 100%;
			pre{
				box-sizing: border-box;
			}
		}
	}
</style>