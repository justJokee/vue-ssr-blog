<template>
	<div class = "timeLine">
		<h1 class = "timeLine-header">时间轴</h1>
		<div class = "timeLine-content">
			<ul>
				<li v-for = "item in timeLine">
					<a href = "jacascript: void(0)" @click = "jumpTime(item.time)">
					{{ item.time }}({{ item.num }})</a>
				</li>			
		</ul>
		</div>
	</div>
</template>
<script>
	import { mapState,mapActions } from "vuex"
	export default{
		mounted(){
			this.getTime({
				publish: true
			})
		},
		computed: {
			...mapState(["timeLine"])
		},
		methods: {
			...mapActions(["getTime"]),
			jumpTime: function(time){
				let year = time.match(/\d+/g)[0],
					month = parseInt(time.match(/\d+/g)[1]),
					endDay,
					date
				if(month === 2){
					endDay = 28
				}else if(month === 1||month == 3||month === 5||month === 7||month === 8||month === 10||month === 12){
					endDay = 31
				}else{
					endDay = 30
				}
				for (let i = 0;i < 9;i++){
					if(month === i){
						month = "0" + month
					}
				}
				date = year + "-" + month + "-" + "01" + "to" + year + "-" + month + "-" + endDay
				this.$router.push({name: "timeLine",params: {time: date}})
			}
		}
	}
</script>
<style lang="less" scoped>
	.timeLine{
		background: #FAF7F7
	}
	.timeLine-header{
		text-align: center;
		padding: 15px;
		color: #EEE;
	    background: #2e3033;
	}
	.timeLine-content{
		padding: 5px 10px 35px;
		li{
			list-style: none;
			border-bottom: 1px solid #ddd;
		}
		a{
			display: block;
			justify-content: space-between;
			width: 120px;
			padding: 10px;
			margin: 0 auto;
			color: #16a085;
		}
		a:hover{
			text-decoration: underline
		}
	}
</style>