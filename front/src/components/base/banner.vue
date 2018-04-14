<template>
	<div class = "header">
		<!-- 给图片加遮罩层 -->
		<div class = "banner">
			<ul>
				<transition-group name = "slider-fade" tag = "div">
					<!-- transition-group中v-for若有index，则必须绑定key值，否则报错 -->
					<li v-for = "(item,index) in bannerData"  v-bind:key = "index" v-show = "index === currentIndex" :class ="{'current-relative': index === currentIndex}" @touchmove.stop = "touchMove($event,index)" @touchstart.stop = "touchStart($event)" @touchend.stop = "touchEnd($event)">
						<img :src= item.url alt="">
						<div class = "banner-shadow"></div>
					</li>
				</transition-group>
			</ul>
			<div class = "circle">
				<div v-for = "(item,_index) in bannerData">
					<span :class = "{'current-circle': _index === currentIndex}" @click = "chosePic(_index)" @mouseover = "stopSlider_cpt" @mouseleave = "startSlider" @touchstart = "stopSlider" @touchend = "startSlider"></span>
				</div>
			</div>
		</div>
		<!-- <div class = "banner-shadow"></div> -->
	</div>
</template>
<script>
	export default{
		data(){
			return{
				currentIndex: 0,
				startPos: {x: "",y: "",date: ""},
				move: {x: "",y: ""},
				bannerData: [{url: "/img/banner/one.jpeg"},{url: "/img/banner/two.jpg"},{url: "/img/banner/three.jpeg"},{url: "/img/banner/four.jpeg"},{url: "/img/banner/five.jpg"}]
			}
		},
		mounted(){
			this.slider()
		},
		methods: {
      		slider: function(index){
      			clearInterval(this.timer)
      			let that = this
      			this.timer = setInterval(() => {
      				if(that.currentIndex < that.bannerData.length - 1){
      					that.currentIndex++
      				}else{
      					that.currentIndex = 0
      				}
      			},4500)
      		},
      		chosePic: function(index){
      			this.currentIndex = index
      		},
      		startSlider: function(){
      			this.slider()
      		},
      		stopSlider: function(){
      			clearInterval(this.timer)
      		},
      		//移动端也会触发mouseover事件（奇怪--），所以做一下判断，否则手动切换图片会消除定时器
      		stopSlider_cpt: function(){
      			if (!/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
				    clearInterval(this.timer)
				}
      		},
      		//移动端滑动
      		touchStart(event){
      			clearInterval(this.timer)
      			let touch = event.targetTouches[0] //touches数组对象获得屏幕上所有的touch，取第一个touch
			　　this.startPos = {x: touch.pageX,y: touch.pageY,date: +new Date} //取第一个touch的坐标值
      		},
      		touchMove: function(event,index){
      			//防止滚屏
      			event.preventDefault()
				if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return
		　      let touch = event.targetTouches[0]
				this.move.x = touch.pageX - this.startPos.x
				this.move.y = touch.pageY - this.startPos.y
      		},
      		touchEnd(event){
      			console.log("touchend触发")
      			let ted = event.targetTouches[0],//touches数组对象获得屏幕上所有的touch，取第一个touch
      			moveDate = +new Date() - this.startPos.date
      			if(Math.abs(this.move.x) > Math.abs(this.move.y)&&moveDate<1000&&this.move.x < -150){
					if(this.currentIndex < this.bannerData.length - 1){
						this.currentIndex++
						this.move = {x: 0,y: 0,date: ""}
					}else{
						this.currentIndex = 0
						this.move = {x: 0,y: 0,date: ""}
					}
				}
				if(Math.abs(this.move.x) > Math.abs(this.move.y)&&moveDate<1000&&this.move.x > 150){
					if(this.currentIndex > 0){
						this.currentIndex--
						this.move = {x: 0,y: 0,date: ""}
					}else{
						this.currentIndex = this.bannerData.length-1
						this.move = {x: 0,y: 0,date: ""}
					}
				}
				this.slider()
      		}
    	}
	}
</script>
<style lang="less">
	.header{
		width: 100%;
		height: 100%;
		padding-bottom: 1px;
		background: #1D5C81;
		position: relative;
	}
	.banner{
		position: relative;
		width: 100%;
		height: 100%;
		background: #fff;
		overflow: hidden;
		ul{
			height: 100%;
			width: 100%;
		}
		ul div{
			height: 100%;
			width: 100%;
			display: block;
			position: relative;
		}
		ul li{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
		img,{
			width: 100%;
			margin-bottom: -5px;//li包裹a标签下方会有5px间距
			height: 100%
		}
		.banner-shadow{
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			background: #000;
			opacity: 0.3;
		}
	}
	.headerHeight{
		height: 0!important
	}
	.slider-fade-enter,.slider-fade-leave-to{
		opacity: 0
	}
	.slider-fade-enter-active,.slider-fade-leave-active{
		transition: opacity ease-in-out 0.5s
	}
	.current-relative{
		position: relative!important
	}
	.circle{
		position: absolute;
		bottom: 0;
		left: 50%;
		margin-left: -60px;
		z-index: 250;
		div{
			display: inline-block;
			width: 20px;
			height: 20px;
			text-align: center;
		}
		span{
			display: inline-block;
			transition: all ease-in 0.5s;
			width: 8px;
			height: 8px;
			border-radius: 4px;
			background: #eee;
			cursor: pointer;
		}
	}
	.banner .circle .current-circle{
		width: 20px;
		height: 8px;
		border-radius: 4px;
		background: orange
	}
	@media screen and (max-width: 768px){
		.header,.banner img{
			height: auto
		}
	}
</style>