<template>
  	<div id = "app">
    	<keep-alive v-if = "$route.meta.keepAlive">
            <router-view/>
        </keep-alive>	
  		<router-view v-if = "!$route.meta.keepAlive"></router-view>
  	</div>
</template>
<script>
    export default {
        name: 'app'
    }
</script>
<style lang = "less">
  	*{
   		margin: 0;
   		padding: 0;
  	}
    html{
      height: 100%;
    }
  	body{
        position: relative;
        width: 100%;
        height: 100%;
	    font: 400 16px/20px Arial,Helvetica,Tahoma,"华文细黑","Microsoft YaHei","微软雅黑",sans-serif;
	    color: #000;
  	}
    #app{
        width: 100%;
        height: 100%
    }
</style>

