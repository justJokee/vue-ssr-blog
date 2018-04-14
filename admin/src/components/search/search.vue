<template>
	<div class = "search-articles">
		<div class = "search-info">以下是为您搜索到的内容：</div>
		<div class = "search-empty" v-if = "!articles.search.length">啊哦~~空空如也</div>
		<list :article_list = "articles.search" v-if = "articles.search.length"></list>
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
			document.title = "后台管理 -文章搜索"
			next((vm) =>{
				if(from.name !== "search"){
					vm.getSearch(to)
				}
			})
		},
		created(){
			this.getSearch(this.$route)
		},
		beforeRouteUpdate(to,from,next){	
			this.getSearch(to)
			next()
		},
		computed: {
			...mapState(["articles"])
		},
		methods: {
			...mapActions(["search","getArticlesCount"]),
			getSearch: function(route){
				//时间范围搜索
				if(route.params.base.indexOf("-") !== -1){
					let timeArr = route.params.base.match(/\d+\-\d+\-\d+/g)
					//utc时间0点起
					let startTime = new Date(Date.parse(timeArr[0])).getTime()
					//utc时间24点
					let endTime = new Date(Date.parse(timeArr[1])).getTime()+1000*60*60*24
					this.search({
						publish: true,
						start: startTime,
						end: endTime,
						page: 1
					})
					this.getArticlesCount({
						publish: true,
						start: startTime,
						end: endTime
					})
					//关键词搜索
				}else{
					this.search({
						publish: true,
						key: route.params.base,
						according: "key",
						page: 1
					})
					this.getArticlesCount({
						publish: true,
						key: route.params.base
					})
				}
			}
		}
	}
</script>
<style lang = "less">
	.search-articles{
		margin-top: 15px;
	}
	.search-info{
		padding: 5px;
		color: orange;
	}
	.search-empty{
		text-align: center;
		font-size: 28px;
		margin-top: 20px;
	}
</style>