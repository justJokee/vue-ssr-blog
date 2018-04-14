<template>
	<div class = "page" >
		<button @click="prePage" :disabled = "preDisabled" class = "changebtn"> < </button>
		<button 
		v-for="(page,index) in pageArr" 
		:disabled = "page == currentPage"
		:class = "{'btn-bg': index === currentPage-1}"
		@click = "changePage(page)"
		> {{page}} </button>
		<button  @click = "nextPage" :disabled = "nextDisabled" class = "changebtn"> > </button>
	</div>
</template>
<script>
	import { mapState,mapActions} from "vuex"
	export default{
		data(){
			return {
				currentPage: 1,
				preDisabled: true,
				nextDisabled: false,
			}
		},
		watch: {
			currentPage: function(){
				let cpg = this.currentPage
				//按钮锁定
				if(cpg === 1){
					this.preDisabled = true
				}else if(cpg > 1){
					this.preDisabled = false
				}
				//后退按钮锁定
				if(cpg < this.pageArr.length){
					this.nextDisabled = false
				}else if(cpg === this.pageArr.length){
					this.nextDisabled = true
				}
			}
		},
		computed: {
			...mapState(["pageArr"]),
		},
		methods: {
			...mapActions(["getArticles","timeArticles","search","getLeaveWords"]),
			prePage(){
				if(this.currentPage > 1){
					this.currentPage--
					this.changePage(this.currentPage)
				}
			},
			nextPage(){
				if(this.currentPage < this.pageArr.length){
					this.currentPage++
					this.changePage(this.currentPage)
				}
			},
			changePage(page){
				let payload = {}
				let tag = ""
				this.currentPage = page
				switch(this.$route.name){
					case "home" : 
					this.getArticles({
						publish: true,
						page: page,
						tag: false
					})
					break
					case "techincal" : 
					this.getArticles({
						publish: true,
						page: page,
						tag: this.$route.params.articleList
					})
					break
					case "life" : tag = "life"
					this.getArticles({
						publish: true,
						page: page,
						tag: tag
					})
					break
					case "timeLine" : 
					let timeArr = this.$route.params.time.match(/\d+\-\d+\-\d+/g)
					//utc时间0点起
					let startTime = new Date(Date.parse(timeArr[0])).getTime()
					//utc时间24点
					let endTime = new Date(Date.parse(timeArr[1])).getTime() + 1000*60*60*24
					let params = {
						publish: true,
						page: page,
						start: startTime,
						end: endTime
					}
					this.timeArticles(params)
					break
					case "msgboard": 
					this.getLeaveWords({page: page})
					break
					case "search": 
					this.search({
						publish: true,
						page: page,
						key: this.$route.params.searchKey,
						according: "key"
					})
				}
			}
		}
	}
</script>
<style lang = "less">
	.page{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 5px;
	}
	.page button{
		color: #fff;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		background: #85B9C8;
		display: inline-block;
		width: 30px;
		height: 28px;
		margin: 2px;
		vertical-align: center
	}
	.page button[disabled]{
		cursor: auto;
	}
	.page .btn-bg{
		background: #C6EAF5!important;
	}
	.page .changebtn{
		width: 50px;
	}
</style>