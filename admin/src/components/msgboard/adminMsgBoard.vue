<template>
	<msbdAndCmsList :mcList = "msgBoard" :initTable = "_initTable"></msbdAndCmsList>
</template>
<script>
	import { mapState,mapActions } from "vuex"
	import msbdAndCmsList from "@/components/c-m-list/msbdAndCmsList.vue"
	export default {
		data(){
			return {
				init:{th:["序号","用户名","留言","时间"]}
			}
		},
		components: {
			msbdAndCmsList
		},
		beforeRouteEnter(to,from,next){
			next((vm) =>{
				vm.getMsgCount()
				document.title = "后台管理 -留言管理"
			})
		},
		created(){
			this.getMsgBoard({page:1})
		},
		computed: {
			...mapState(["msgBoard"]),
			_initTable(){
				return this.init
			}
		},
		methods: {
			...mapActions(["getMsgBoard","getMsgCount"])
		}
	}
</script>