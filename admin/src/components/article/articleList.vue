<template>
	<div class = "admin-article-list-box">
		<table class = "admin-article-list">
			<!-- 表格头部 -->
			<thead>
				<tr>
					<th>
						<div class = "chose" :class = "{'checked': ifchecked}">
							<input type="checkbox" id = "checkAll"  v-model = "ifchecked">
							<label for="checkAll" @click = "allChecked">全选</label>
						</div>
					</th>
					<th>ID</th>
					<th>标题</th>
					<th>标签</th>
					<th>浏览</th>
					<th>喜欢</th>
					<th>评论</th>
					<th>发表时间</th>
					<th>操作</th>
				</tr>
			</thead>
			<!-- 表格主题 -->
			<tbody class = "tbody-list">
				<tr v-for = "(item,index) in article_list" :class = "{'bg': articleItem.indexOf(item.articleId) !== -1 }">
					<td >
						<div class = "chose" :class = "{'checked': articleItem.indexOf(item.articleId) > -1}">
							<input :id = "'checkbox-item'+index" type = "checkbox" v-bind:value = "item.articleId" @click = "singleChecked" v-model = "articleItem">
							<label :for = "'checkbox-item' + index"></label>
						</div>	
					</td>
					<td>{{ index+1 }}</td>
					<td :title = item.title>{{ item.title }}</td>
					<td ><span v-for = "tag in item.tag" ref = "listTag" class = "tbody-list-tag">{{ tag | changeLife }}</span></td>
					<td>{{ item.pv }}</td>
					<td>{{ item.likeNum }}</td>
					<td>{{ item.commentNum }}</td>
					<td>{{ item.date | reviseTime }}</td>
					<td class = "some-handle">
						<span @click = "review(item)"><span class = "icon-eye icon-eye-a" title = "预览"></span></span>
						<span @click = "update(item)" :class = "{'waiting': updateInfo.wait}"><span class = "icon-crop icon-crop-a" title = "修改"></span></span>
						<span @click = "sureDelete(item.articleId,index)"><span class = "icon-bin icon-bin-a" title = "删除"></span></span>
					</td>
				</tr>
			</tbody>
		</table>
		<div class = "remove-all" v-show = "articleItem.length">
			<button @click = "sureDelete(-1)">删除选中项</button>
		</div>	
		<transition name = "fade" mode = "out-in">	
			<page v-show = "pageArray.length > 1"></page>
	    </transition>
	    <transition name = "fade">
		    <div class = "validate-mask" v-show = "!!sureInfo.type.length">
		    	<div class = "validate-bin">
		    		<div class = "exit-validate" ><span @click = "sureInfo.type = ''">X</span></div>
		    		<div class = "sure-delete">
		    			<h3>{{ sureInfo.warning }}</h3>
	    				<button @click = "remove">确定</button>
	    				<button @click = "sureInfo.type = ''">取消</button>
		    		</div>
		    	</div>
		    </div>
		</transition>
		<transition name = "fade">
			<div class = "validate-mask" v-show = "updateInfo.show">
		    	<div class = "update-warning">
		    		<h3>数据抓取超时，请稍后再试...</h3>
		    		<button @click = "updateInfo = {show: false,wait: false}">确定</button>
		    	</div>
		    </div>
		</transition> 
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions} from "vuex"
	import page from "@/components/base/page"
	export default {
		components: {
			page
		},
		props: {
			article_list: {
				type: Array
			}
		},
		//定义过滤器，将life标签替换为“生活”
		filters: {
			changeLife: function(value){
				if(value === "life"){
					value = "生活"
					return value
				}else{
					return value
				}
			}
		},
		data(){
			return {
				ifchecked: false,
				articleItem: [],
				deleteInfo: {aid: -1,index: -1},
				sureInfo: {warning: "",type: ""},
				updateInfo: {show: false,wait: false},
				color: ["#FF9933","#663300","#CC6600","#99CC33","#9933FF","#009966","#FFCC99","#336666","#CC6699","#CCCC00"]
			}
		},
		mounted(){
			if(this.article_list.length){
				this.$nextTick(()=>{
					this.$refs.listTag.forEach((item,index,arr) =>{
						item.style.background = "#" + Math.floor(Math.random()*0xffffff).toString(16)
					})
				})
			}
		},
		computed: {
			...mapState(["pageArray"])
		},
		watch: {
			article_list: function(){
				this.ifchecked = false
				this.articleItem = []
				this.$nextTick(()=>{
					if(this.article_list.length){
						this.initBackground()
					}
				})
			}
		},
		methods: {
			...mapMutations(["productView","reduceArr","reduceArr_all"]),
			...mapActions(["removeArticle","getArticle"]),
			initBackground: function(){
				this.$refs.listTag.forEach((item,index,arr) =>{
					item.style.background = this.color[Math.floor(Math.random()*10)]
				})
			},
			singleChecked: function(){
				//加定时器是因为先触发click事件，此时articleItem
			    //还没有被推入新的值，因此将此事件推入事件队列，先让articleItem插值完成
				setTimeout(() => {
					if(this.articleItem.length === this.article_list.length){ 
						this.ifchecked = true  							  					
					}else{
						this.ifchecked = false
					}
				},0)
			},
			allChecked: function(){
				if(this.articleItem.length !== this.article_list.length){
					let _arr = []
					this.article_list.forEach((item,index,arr) => { 
						_arr.push(item.articleId)
					})
					this.articleItem = _arr
				}else{
					this.articleItem = []
				}
			},
			review: function(item){
				this.$router.push({name: "review",params: {eTag: item.tag[0],articleId: item.articleId}})
			},
			update: function(item){
				let that = this
				this.updateInfo = {show: false,wait: true}
				this.getArticle({tag: item.tag[0],articleId: item.articleId}).then((data) =>{
					if(data.length){
						this.updateInfo = {show: false,wait: false}
						if(that.$route.path === "/admin/draft"){
							that.$router.push({name: "draftrevise"})
						}else{
							that.$router.push({name: "update"})
						}
					}else{
						this.updateInfo = {show: true,wait: false}
					}
				})
			},
			sureDelete: function(aid,index){
				let sInfo = this.sureInfo,
					dInfo = this.deleteInfo
				//选中删除操作
				if(aid === -1){
					sInfo.warning = "确定删除选中的" + this.articleItem.length +"项么？"
					sInfo.type = "all"
				}else{
					dInfo.index = index
					dInfo.aid = aid
					sInfo.warning = "确定删除此项么？"
					sInfo.type = "single"
				}	
			},
			remove: function(){
				if(this.sureInfo.type === "single"){
					this.removeSingle()
				}else{
					this.removeAll()
				}
			},
			removeSingle: function(){
				let that = this,
					routeName = this.$route.name,
					dInfo = this.deleteInfo
				this.removeArticle({articleId: [dInfo.aid]}).then((data) =>{
					if(data.deleteCode === 200){						
						that.reduceArr({name: routeName,index: dInfo.index})
						this.sureInfo.type = "" //退出确认框
					}
				})
			},
			removeAll(){
				let that = this
				this.removeArticle({articleId: this.articleItem}).then((data) =>{
					if(data.deleteCode === 200){						
						that.reduceArr_all({name: this.$route.name,removeArr: that.articleItem})
						this.sureInfo.type = "" //退出确认框
					}
				})
			}
		}
	}
</script>
<style lang = "less">
	.bg{
		background: #FFF38F!important;
	}
	.some-handle span{
		cursor: pointer;
	}
	.admin-article-list{
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		color: #606266;
		tr{	
			border-bottom: 1px solid #ccc;
			text-align: center;
		}
		th{
			color: #333;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			border: 1px solid #ccc;
			padding: 5px;
		}
		td{
			border: 1px solid #ccc;	
			padding: 5px;
		}
		td:not(:last-child){		
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		input[type="checkbox"],label{
			vertical-align: middle;
		}
	}
	.tbody-list tr:nth-child(odd){
		background: #F5F7FA;
	}
	.tbody-list-tag{
		display: inline-block;
		margin: 0 2px;
		padding: 2px 5px;
		border-radius: 3px;
		color: #ffffff;
	}
	.chose{
		text-align: left;
		width: 12px;
		position: relative;
		background: url("/img/checkbox.png") no-repeat;
		background-position: 0 50%;
		input{
			position: absolute;
			visibility: hidden;
		}
		label{
			padding-left: 13px;
		}
	}
	.checked{
		background-position: -16px 50%;
	}
	.validate-mask{
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0,.5);
	}
	.validate-bin,.update-warning{
		margin: 50px auto 0;
		border-radius: 5px;
		width: 30%;
		height: 200px;
		background: #ffffff;
		overflow: hidden;
	}
	.exit-validate{
		border-radius: 5px 5px 0 0;
		background: #F7F7F7;
		text-align: right;
		padding: 5px 10px 5px 0;
		span{
			cursor: pointer;
		}
	}
	.sure-delete,.update-warning{
		text-align: center;
		color: #E6A23C;
		h3{
			margin-top: 50px;
		}
		button:hover{
			opacity: 0.8;
		}
	}
	.update-warning h3{
		margin-top: 70px;
	}
	.sure-delete button,.update-warning button{
		outline: none;
		color: #fff;
		cursor: pointer;
		border: none;
		border-radius: 5px;
		padding: 5px 8px;
		background: #409EFF;
		margin: 50px 10px 0;
	}
	.remove-all{
		display: flex;
		button{
			outline: none;
			color: #fff;
			cursor: pointer;
			border: none;
			border-radius: 5px;
			padding: 5px 10px;
			background: #E6A23C;
			margin: 5px 5px 0 0;
		}
		button:hover{
			opacity: 0.9;
		}
	}
	.waiting,.waiting span{
		cursor: wait!important;
	}
	.icon-crop-a,.icon-eye-a,.icon-bin-a{
		box-sizing: border-box;
		width: 28px;
		height: 28px;
		font-size: 16px;
		display: inline-block;
		padding: 5px;
		border: 1px solid #CCC;
		border-radius: 2px;
	}
	.icon-crop-a:hover,.icon-eye-a:hover,{
		color: #ffffff;
		background: #409EFF
	}
	.icon-bin-a:hover{
		color: red;
		background: #409EFF
	}
	.fade-enter-active, .fade-leave-active {
 		transition: opacity .3s
	}
	.fade-enter, .fade-leave-to {
 		opacity: 0
	}
	@media screen and(min-width: 768px){
		.icon-crop-a,.icon-eye-a,.icon-bin-a{
			margin-left: -5px;
		}
		.icon-eye-a{
			margin-left: -4px;
		}
	}
	@media screen and(max-width: 767px){
		.validate-bin{	
			width: 80%;
		}
	}
</style>