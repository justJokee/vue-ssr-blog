<template>
	<div class = "hot">
		<h2 class = "hot-header">推荐</h2>
		<div class = "hot-content">
			<ul>
				<li v-for = "(item,index) in articles.hot">
					<div class = "hot-item">
						<span>{{ index+1 }}. </span><a href = "jacascript: void(0)" :title = item.title @click = "jumpHot(item)">{{ item.title}}</a>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	import { mapState,mapActions,mapMutations } from "vuex"
	export default{
		mounted(){
			this.getHot()
		},
		computed: {
			...mapState(["articles"])
		},
		methods: {
			...mapActions(["getHot"]),
			jumpHot: function(item){
				if(item.tag[0] === "life"){
					this.$router.push({name: 'lifeShow',params : {id: item.articleId}})
				}else{
					this.$router.push({name: 'articleShow',params : {articleList: item.tag[0],id: item.articleId}})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.hot{
		background: #FAF7F7
	}
	.hot-header{
		text-align: center;
		padding: 15px;
		color: #EEE;
	    background: #2e3033;
	}
	.hot-content{
		li{
			font-size: 14px;
			list-style: none;
			color: #16a085;
			border-bottom: 1px solid #ddd;
			margin-left: 15px;
		}
		a{
			display: inline-block;
			padding: 10px;
			color: #16a085;
		}
		a:hover{
			text-decoration: underline;
		}
	}
	.hot-item{
		overflow: hidden;
		text-overflow: ellipsis;//超出部分显示省略号
		white-space: nowrap
	}
</style>