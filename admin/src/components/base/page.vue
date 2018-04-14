<template>
	<div class = "page">
		<button  @click="prePage" :disabled = "preDisabled" class = "changebtn"> < </button>
		<button 
		v-for="(page,index) in pageArray" 
		:disabled="page == currentPage"
		:class = "{'btn-bg' : index === currentPage-1}"
		@click = "changePage(page)"
		> {{page}} </button>
		<button  @click = "nextPage" :disabled = "nextDisabled" class = "changebtn"> > </button>
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
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
				if(cpg < this.pageArray.length){
					this.nextDisabled = false
				}else if(cpg === this.pageArray.length){
					this.nextDisabled = true
				}
			}
		},
		computed: {
			...mapState(["pageArray"]),
		},
		methods: {
			...mapActions(["getArticles","search","getMsgBoard","getAdminComments"]),
			prePage(){
				if(this.currentPage > 1){
					this.currentPage--
					this.changePage(this.currentPage)
				}
			},
			nextPage(){
				if(this.currentPage < this.pageArray.length){
					this.currentPage++
					this.changePage(this.currentPage)
				}
			},
			changePage(page){
				let payload = {}
				let tag = ""
				this.currentPage = page
				switch(this.$route.name){
					case "allArticles" : 
					this.getArticles({
						publish: true,
						page: page,
						tag: false
					})
					break
					case "eachTag" : 
					this.getArticles({
						publish: true,
						page: page,
						tag: this.$route.params.tag
					})
					break
					case "draft" : 
					this.getArticles({
						publish: false,
						page: page
					})
					break
					case "adminMsgBoard" : 
					this.getMsgBoard({page: page})
					break
					case "comments" : 
					this.getAdminComments({page: page})
					break
					case "search" : 
					if(this.$route.params.base.indexOf("-") !== -1){
						let timeArr = this.$route.params.base.match(/\d+\-\d+\-\d+/g)
						//utc时间0点起
						let startTime = new Date(Date.parse(timeArr[0])).getTime()
						//utc时间24点
						let endTime = new Date(Date.parse(timeArr[1])).getTime()+1000*60*60*24
						this.search({
							publish: true,
							start: startTime,
							end: endTime,
							page: page
						})
					}else{
						this.search({
							publish: true,
							key: this.$route.params.base,
							according: "key",
							page: page
						})
					}
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
		color: #1A1A1A;
		border: 1px solid #85B9C8;
		border-radius: 3px;
		cursor: pointer;
		background: #ffffff;
		display: inline-block;
		width: 30px;
		height: 28px;
		margin: 2px;
		vertical-align: center;
		outline: none;
	}
	.page button[disabled]{
		cursor: auto;
	}
	.page .btn-bg{
		background: #C6EAF5!important;
	}
	.page .changebtn{
		width: 30px;
	}
</style>