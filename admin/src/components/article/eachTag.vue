<template>
	<div class= "admin-articles-tag">
		<list :article_list = "articles.tags"></list>
	</div>
</template>
<script>
	import { mapActions,mapState,mapMutations } from "vuex"
	import list from "@/components/article/articleList"
	export default{
		components: {
			list
		},
		created(){
			this.getAdminArticles()
			document.title = "后台管理--" + this.$route.params.tag + "文章"
		},
		computed: {
			...mapState(["articles"])
		},
		watch: {
			"$route":function(){
				this.getAdminArticles()
				document.title = "后台管理--" + this.$route.params.tag
			}
		},
		methods: {
			...mapActions(["getArticles","getArticlesCount"]),
			getAdminArticles:function(){	
				let payload = {
					publish:true,
					tag:this.$route.params.tag,
					page:1
				}
				this.getArticles(payload)
				this.getArticlesCount(payload)
			}
		}
	}
</script>
<style lang = "less">
	.admin-articles-tag{
		margin-top: 15px;
	}
</style>