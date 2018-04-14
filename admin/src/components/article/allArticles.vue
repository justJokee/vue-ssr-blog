<template>
	<div class = "admin-articles">
		<list :article_list = "articles.all"></list>
	</div>
</template>
<script>
	import { mapActions,mapState,mapMutations } from "vuex"
	import list from "@/components/article/articleList"
	export default {
		components: {
			list
		},
		//组件缓存后，为了让每个模块显示正确的页码，故重新计算页码数
		beforeRouteEnter(to,from,next){
			next((vm) => {
				vm.getArticlesCount({publish:true})
				document.title = "后台管理 -已发表文章"
			})
		},
		created(){
			this.allArticles_admin()
		},
		computed: {
			...mapState(["articles"])
		},
		methods: {
			...mapActions(["getArticles","getArticlesCount"]),
			allArticles_admin:function(){
				let payload = {
					publish: true,
					page: 1
				}
				this.getArticles(payload)
			}
		}
	}
</script>
<style lang = "less">
	.admin-articles{
		margin-top:15px;
	}
</style>