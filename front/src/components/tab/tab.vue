<template>
	<div class = "tab" ref = "tab" :class = "{'tab-bg': tabBg}">
		<nav class = "navbar">
			<div class = "nav-header">
				<div class = "logo">
					<img src = "/img/logo.png" alt = "">
				</div>
				<button class = "navbar-toggle" @click = "navShow" :class = "{'toggle-click': show}">
					<div class = "line"></div>
					<div class = "line"></div>
					<div class = "line"></div>
				</button>
			</div>
			<div class = "nav-body" :class = "{heightZero: show}">
				<ul class = "nav-list" >
					<li v-for = "(item,index) in tabs" >
						<router-link :to = "{name: item.name}" tag = "div">
							<span class = "bg-box"  @click.stop = "goAnchor(item.name,index)">
								<span class = "span-box">
									<span :class = "item.icon"></span>
									<span>{{ item.render }}</span>
								</span>
							</span>	
						</router-link>
					</li>
				</ul>
				<div class = "search">
					<input type = "text" placeholder = "请输入关键词" v-model = "searchKey" @keyup.enter = "search">
					<span class = "icon-search search-article" @click = "search"></span>
				</div>
			</div>	
		</nav>
	</div>
</template>
<script>
	import { mapState,mapMutations } from "vuex" 
	import { getElementTop } from "@/utils/getElementTop"
	import { getScrollTop } from "@/utils/getScrollTop"
	import { requestAnimation }   from "@/utils/requestAnimation"
 	export default {
		data(){
			return{
				show: false,
				fixed: false,
				searchKey: "",
				scrollFlag: 0,
				routeName: "",
				intervalId: "",
				tabs: [{name: "home",render: "首页",icon: "icon-home"},{name: "article",render: "文章",icon: "icon-book"},{name: "msgboard",render: "留言",icon: "icon-messages"},{name: "life",render: "生活",icon: "icon-images"}]
			}	
		},
		mounted(){
			requestAnimation()
		},
		computed: {
			...mapState(["tabBg","anchorScroll"])
		},
		methods: {
			...mapMutations(["changeRtActive"]),
			navShow(){
				this.show = !this.show;	
			},
			search: function(){
				if(!this.searchKey.length){
					 return	
				}else{
					this.active = -1
					this.$router.push({name: 'search',params: {searchKey: this.searchKey}})
				}
			},
			callback: function(){
				let movepx = Math.ceil((this.anchorScroll.move/250)*(1000/60)),	
				that = this,
				scrollTop = getScrollTop()
				if(scrollTop < this.anchorScroll.top){
			  		document.documentElement.scrollTop = Math.min(scrollTop + movepx,this.anchorScroll.top)
			  		document.body.scrollTop = Math.min(scrollTop + movepx,this.anchorScroll.top)  
					//当页面不够长使锚点滚动不到页面顶端时，清除定时器
					if(getScrollTop() === scrollTop){
						this.$router.push({name: this.routeName})
						window.cancelAnimationFrame(that.intervalId)
					}else{
						window.requestAnimationFrame(that.callback)
					}
				}else if(scrollTop > this.anchorScroll.top){
					document.documentElement.scrollTop = Math.max(scrollTop - movepx,this.anchorScroll.top)
					document.body.scrollTop = Math.max(scrollTop - movepx,this.anchorScroll.top)
					window.requestAnimationFrame(that.callback)
				}else{
					window.cancelAnimationFrame(that.intervalId)
					this.$router.push({name: this.routeName})
				}	
			},
			//锚点动态跳转
			goAnchor: function(route,index){
				this.show = !this.show
				this.routeName = route
				this.intervalId = window.requestAnimationFrame(this.callback)		
			}
		}
	}
</script>
<style lang = "less">
	.tab{
		position: fixed;
		top: 0;
		left: 0;
	    z-index: 1000;
	    width: 100%;
		color: #EEE;
		transition: all ease .5s;
		transform: translateZ(0);/*开启GPU硬件加速，提高性能和流畅的动画效果,否则其他元素有css动画时，fixed的nav有异常抖动*/
		li{						 
			list-style: none;
		}
	}
	.tab .router-link-active{
		color: orange;
	}
	.tab .no-active{
		color: #EEE
	}
	.tab-bg{
		background: rgba(0,0,0,.7);
		span:before,span:after{
			height: 0!important
		}
	}
	.nav-body{
		height: 50px
	}						
	.logo{
		float: left;
		height: 46px;
		padding-top: 4px;
		img{
			width: 45px;
			height: 45px
		}
	}
	.navbar-toggle{
		outline: none;
		cursor: pointer;
		background: rgba(0,0,0,0);
		margin: 8px 15px 7px 0;
		padding: 9px 10px;
		border: 1px solid #333;
		float: right;
		border-radius: 4px;
		transition: all ease .5s;
		-webkit-tap-highlight-color: rgba(0,0,0,0); 
		.line{
			height: 2px;
			width: 22px;
			background: #fff;
			margin-top: 3px;
			border-radius: 1px;
		}
	}
	.toggle-click{
		background: #1A1A1A;
	}
	.search{
		position: relative;
		input{
			border: none;
			border: 1px solid #EEE;
			outline: none;
			width: 134px;
			height: 20px;
			padding: 6px 28px 6px 12px;
			margin: 8px 0;
			color: #1A1A1A;
			border-radius: 17px;
			background: #EEE;
			transition: all ease .5s;
		}
	}
	.icon-search{
		position: absolute;
		top: 18px;
		right: 42px;
		display: inline-block;
		color: #1A1A1A
	}
	.search-article{
		cursor: pointer
	}
	
	.nav-header:after,.navbar:after,.nav-body:after {
	    clear: both;
	    content: ".";
	    display: block;
	    height: 0;
	    line-height: 0;
	    visibility: hidden;
  	}
	@media screen and(max-width: 767px){
		.logo{
			padding-left: 20px
		}
		.icon-search{
			right: 16px;
		}
		.search{
			border-top: 1px solid #262626;
			border-bottom: 1px solid #262626;
			width: 100%;
			input{
				box-sizing: border-box;
				height: 36px;
				padding-right: 34px;
				width: 100%;
			}
		}
		.nav-body{
			position: absolute;
			background: rgba(0, 0, 0, 0.6);
			width: 0;
			height: 0;
			overflow: hidden;
			transition: all ease .4s;
		}
		.heightZero{
			width: 100%;
			height: 300px;/*必须有确切高度 否则触发不了动画*/
		}
		.tab{
			background: rgba(0,0,0,.6);
		}
		.tab .router-link-active,.router-link-active .bg-box{
			background: orange;
			color: #EEE
		}
		.nav-list{
			position: absolute;
			margin-top: 53px;
			width: 100%;
			li{
				height: 50px;
			}
			div{
				height: 0
			}
			.bg-box{
				position: relative;
				cursor: pointer;
				display: inline-block;
				height: 50px;
				width: 100%;
			}
			.span-box{
				cursor: pointer;
				position: absolute;
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 50px;
				min-width: 60px;
				margin-left: -30px;
				left: 50%;
			}
			a{	
				display: inline-block;
				box-sizing: border-box;
				padding: 14px 20px;
				width: 100%;
				transition: all ease 0.5s;
				text-align: center;
			}
		}
		.navbar-toggle{
			display: block
		}
	}	
	@media screen and (min-width: 768px){
		.navbar{
			margin-left: auto;	
			margin-right: auto;
		}
		.nav-list{
			float: left;
			margin-left: 1px;
			height: 50px;
			li{
				display: inline-block;
				margin-left: 20px;
				width: 55px;
				height: 50px;
				div{	
					transition: all ease 0.5s;
					position: relative;
					.span-box span{
						font-size: 18px;
						display: inline-block;
						width: 55px;
						height: 50px;
						line-height: 50px;
						text-align: center;
						position: absolute;
						cursor: pointer;
					}
					.span-box span:hover{
						color: #FAAF2E;
					}
					.span-box span:before,.span-box span:after{
						content: "";
						position: absolute;
						top: 100%;
						left: 0;
						width: 100%;
						height: 3px;
						background: #EEE;
						transition: all ease .3s;
						transform: translateZ(0);
					}
					.span-box span:hover:before{
						transform: translateY(-50px) scale(1.2)
					}
					.span-box span:hover:after{
						transform: scale(1.2)
					}
				}
			}
		}
		.nav-header{
			float: left
		}
		.navbar-toggle{
			display: none;
		}
		.search{
			float: right;
			input:focus{
				width: 200px;
			}
		}
	}
</style>