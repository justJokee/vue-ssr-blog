<template>
	<div class = "gateway">	
		<h2 class = "gateway-header">标签</h2>
		<div class = "gateway-content">
			<ul >
				<li v-for = "item in tags" ><a href = "javascript: void(0)" @click = "jumpGate(item.tag)" ref = "tag">{{ item.tag | changeLife }}</a></li>
			</ul>
		</div>
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from "vuex"
	export default{
		data(){
			return{
				color: ["#FF9933","#663300","#CC6600","#99CC33","#CC6699","#009966","#999999","#336666","#9BBFEA","#CCCC00"]
			}
		},
		filters: {
			changeLife: function(value){
				if(value == "life"){
					return "生活"
				}else{
					return value
				}
			}
		},
		mounted(){
			let that = this
			this.getTagsclass({publish: true}).then((data) =>{
				//没有标签则不要初始化，否则会出错
				if(data.length){
					that.initBackground()
				}
			})
		},
		computed: {
			...mapState(["tags"])
		},
		methods: {
			...mapActions(["getTagsclass"]),
			initBackground: function(){
				this.$nextTick(()=>{
					//IE10不支持refs.tag
					this.$refs.tag.forEach((item,index,arr) =>{
						item.style.backgroundColor = this.color[Math.floor(Math.random()*10)]
					})
				})
			},
			jumpGate: function(item){
				if(item === "life"){
					this.$router.push({name: "life"})
				}else{
					this.$router.push({name: "techincal",params: {articleList: item}})
				}
			}
		}
	}
</script>
<style lang = "less" scoped>
	.gateway-header{
		text-align: center;
		padding: 15px;
		color: #eee;
	    background: #2e3033;
	}
	.gateway-content:after{
		display: block;
		content: "";
		clear: both;
		line-height: 0;
		height: 0;
		visibility: hidden;
	}
	.gateway-content{
		background: #FAF7F7;
		padding: 10px;
		li{
			list-style: none;
			border-radius: 5px;
			margin: 5px;
			float: left;
			overflow: hidden;
			a{
				font-size: 14px;
				display: inline-block;
				padding: 6px 15px;
				border-radius: 5px;
				color: #EEE;
				transition: all ease .5s
			}
			a:hover{
				transform: scale(1.5)
			}
		}
	}
</style>