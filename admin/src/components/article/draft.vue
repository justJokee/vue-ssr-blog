<template>
	<div class = "draft">
		<list :article_list = "articles.drafts"></list>
	</div>
</template>
<script>
	import { mapActions,mapState,mapMutations } from "vuex"
	import list from "@/components/article/articleList"
	export default {
		components: {
			list
		},
		beforeRouteEnter(to,from,next){
			next((vm) => {
				vm.getArticlesCount({publish: false})
				document.title = "后台管理 -草稿箱"
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
			allArticles_admin: function(){
				let payload = {
					publish: false,
					page: 1
				}
				this.getArticles(payload)
			}
		}
	}
</script>
<style lang = "less">
	.draft{
		margin-top: 15px;
	}
</style>