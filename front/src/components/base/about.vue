<template>
	<div class = "about">
		<div class = "about-header">
			<h2>关于本站</h2>
		</div>
		<div class = "about-content">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp本站是一个用于知识积累与分享的个人开源博客。主要技术栈为HTML+CSS、vue全家桶、axios、express、mongodb。前端采用vue-ssr渲染，支持文章评论与分享，并设置有留言功能，源码请戳<a href = "https://github.com/justJokee/vue-ssr-blog" target = "_blank">github</a></div>
	</div>
</template>
<style lang = "less" scoped>
	.about-header{
		text-align: center;
		padding: 15px;
		color: #eee;
	    background: #2e3033;
	}
	.about-content{
		color: #1A1A1A;
		background: #FAF7F7;
		padding: 15px;
		line-height: 28px;
		font-size: 14px;
		a{
			margin-left: 5px;
			color: #16a085;
		}
	}
</style>