<template>
	<msbdAndCmsList :mcList = "comments" :initTable = "_initTable"></msbdAndCmsList>
</template>
<script>
	import { mapState,mapActions } from "vuex"
	import msbdAndCmsList from "@/components/c-m-list/msbdAndCmsList"
	export default {
		components: {
			msbdAndCmsList
		},
		data(){
			return{
				init: {th: ["序号","文章标题","昵称","评论","时间"]} 
			}
		},
		beforeRouteEnter(to,from,next){
			next((vm) => {
				vm.getCommentsCount()
				document.title = "后台管理 -文章评论"
			})
		},
		created(){
			this.getAdminComments({page:1})
		},
		computed: {
			...mapState(["comments"]),
			_initTable(){
				return this.init
			}
		},
		methods: {
			...mapActions(["getAdminComments","getCommentsCount"])
		}
	}
</script>