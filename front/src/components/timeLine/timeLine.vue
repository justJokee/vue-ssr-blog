<template>
	<div class = "timeLine">
		<loading v-if = "articles.time.length === 0"></loading>
		<article-list :articleList = "articles.time"></article-list>
	</div>
</template>
<script>
	import { mapActions,mapState,mapMutations} from "vuex"
	import articleList from "@/components/article/articleList"
	import loading from "@/components/base/loading"
	export default {
		components: {
			articleList,
			loading
		},
		metaInfo(){
			return {
				title: "时间轴 -mapblog小站"
			}
		},
		beforeRouteLeave(to,from,next){
			this.clear()
			next()
		},
		created(){	
			this.time_arts()
		},
		computed: {
			...mapState(["articles"])
		},
		watch: {
			$route(){
				this.time_arts()
			}
		},
		methods: {
			...mapActions(["getArticlesCount","timeArticles"]),
			...mapMutations(["clear"]),
			time_arts: function(){
				let timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
				//utc时间0点起
				let startTime = new Date(Date.parse(timeArr[0])).getTime()
				//utc时间24点
				let endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000*60*60*24
				let params = {
					publish: true,
					page: 1,
					start: startTime,
					end: endTime,
					according: "time"
				}
				this.timeArticles(params)
				this.getArticlesCount(params)
			}
		}
	}
</script>
<style lang="less" scoped>

</style>

