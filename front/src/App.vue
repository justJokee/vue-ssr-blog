<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import tab from '@/components/tab/tab'
import gateWay from '@/components/base/gateWay'
import fileOnPlace from '@/components/base/fileOnPlace'
import about from '@/components/base/about'
import hot from '@/components/base/hot'
import foot from '@/components/base/foot'
import { mapState, mapMutations } from 'vuex'
import { getScrollTop } from '@/utils/getScrollTop'
import { getElementTop } from '@/utils/getElementTop'

export default {
  components: {
    tab,
    gateWay,
    fileOnPlace,
    about,
    hot,
    foot
  },
  data() {
    return {
      location: [],
      timer: '',
      showBackTop: true
    }
  },
  watch: {
    $route() {
      if (this.$route.name === 'home') {
        this.location = []
      }
      this.currentLocation(this.$route)
    },
    //当articleShow组件的标题变化时，刷新当前位置的文章标题，防止当前文章显示上一篇文章的标题
    currentTitle() {
      this.currentLocation(this.$route)
    }
  },
  mounted() {
    // this.currentLocation(this.$route)
    // this.scrollCotainer()
    // //页面重载计算锚点距离并判断tab的背景样式
    // this.positionTop(getElementTop(this.$refs.container) - 50)
    // this.getTop()
  },
  computed: {
    ...mapState(['currentTitle'])
  },
  methods: {
    ...mapMutations(['addTabBg', 'positionTop']),
    scrollCotainer: function() {
      window.addEventListener('scroll', this.scroll_resize)
      //改变窗口大小后对导航栏状态重新进行确认
      window.addEventListener('resize', this.scroll_resize)
    },
    scroll_resize: function() {
      this.debounce(this.getTop, 500)
    },
    getAT: function() {
      let top = getScrollTop() - getElementTop(this.$refs.container)
      this.positionTop(top)
    },
    getTop: function() {
      //计算document需要滚动的距离
      let tabOffsetTop = getElementTop(this.$refs.container) - 50
      let move = Math.abs(getScrollTop() - tabOffsetTop)
      if (getScrollTop() > 0) {
        this.showBackTop = true
      } else {
        this.showBackTop = false
      }
      if (getScrollTop() > tabOffsetTop) {
        this.addTabBg(true)
      } else {
        this.addTabBg(false)
      }
      //计算路由改变需要滚动的距离
      this.positionTop({ top: tabOffsetTop, move: move })
    },
    //函数去抖，防止scroll和resize频繁触发
    debounce: function(func, delay) {
      let context = this
      let args = arguments
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(function() {
        func.apply(context, args)
      }, delay)
    },
    back: function(item) {
      let name = item.pathName
      if (name === 'techincal') {
        this.$router.push({ name: name, params: { articleList: item.params.tag } })
      } else if (name === 'articleShow') {
        this.$router.push({ name: name, params: { articleList: item.params.tag, id: item.params.id } })
      } else if (name === 'lifeShow') {
        this.$router.push({ name: name, params: { id: item.params.id } })
      } else {
        this.$router.push({ name: name })
      }
    },
    backTop: function() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    backHome: function() {
      this.location = []
      this.$router.push({ name: 'home' })
    },
    //当前位置的路由信息表
    currentLocation: function(to) {
      switch (to.name) {
        case 'article':
          this.location = [{ pathName: 'article', showName: '技术文章' }]
          break
        case 'techincal':
          let tag = to.params.articleList
          this.location = [
            { pathName: 'article', showName: '技术文章' },
            { pathName: 'techincal', showName: tag, params: { tag: tag } }
          ]
          break
        case 'articleShow':
          let _tag = to.params.articleList
          this.location = [
            { pathName: 'article', showName: '技术文章' },
            { pathName: 'techincal', showName: _tag, params: { tag: _tag } },
            { pathName: 'articleShow', showName: this.currentTitle, params: { tag: _tag, id: to.params.id } }
          ]
          break
        case 'life':
          this.location = [{ pathName: 'life', showName: '生活' }]
          break
        case 'lifeShow':
          this.location = [
            { pathName: 'life', showName: '生活' },
            { pathName: 'lifeShow', showName: this.currentTitle, params: { id: to.params.id } }
          ]
          console.log(this.currentTitle)
          break
        case 'msgboard':
          this.location = [{ pathName: 'msgboard', showName: '留言板' }]
          break
        case 'search':
          this.location = [{ pathName: 'search', showName: '搜索' }]
          break
        case 'timeLine':
          this.location = [{ pathName: 'timeLine', showName: '时间轴' }]
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/reset.scss';
@import './assets/css/prism.css';
@import './assets/css/emoji-sprite.css';
* {
  margin: 0;
  padding: 0;
}
a {
  -webkit-tap-highlight-color: transparent;
}

body {
  font: 400 16px/20px Arial, Helvetica, Tahoma, '华文细黑', 'Microsoft YaHei', '微软雅黑', sans-serif;
  color: #000;
}

#app {
  // margin: 50px 0 0 0;
}

.main {
  width: 100%;
  min-height: calc(100vh - 155px);
}

a {
  text-decoration: none;
}

.body-content,
.container {
  position: relative;
}
.location {
  background: #faf7f7;
  margin-top: 10px;
  padding: 10px;
  font-size: 14px;
  a {
    color: #16a085;
  }
  div {
    display: inline;
  }
}
.section {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.content {
  width: 68%;
}
.r-slide {
  width: 32%;
}
.rocket {
  position: fixed;
  right: 10px;
  bottom: 10px;
  a {
    display: inline-block;
    width: 50px;
    height: 50px;
    background: url('/img/backTop.png') 0 0 no-repeat;
  }
  a:hover {
    background-position: -50px 0;
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.5s;
}
.fix-bg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
//手机端
@media screen and (max-width: 767px) {
  .fix-bg {
    background: #f4f4f4;
  }
  .section {
    flex-wrap: wrap;
    // padding: 10px 15px;
  }
  .section .content,
  .r-slide {
    width: 100%;
  }
  .location {
    margin-top: 0;
  }
}
//平板
@media screen and (min-width: 768px) {
  .fix-bg {
    background: url('/img/mainBg2.jpg') 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .section {
    max-width: 760px;
    padding: 10px 30px;
  }
  .navbar {
    max-width: 820px;
  }
  .search {
    padding: 0 30px;
  }
  .nav-header {
    padding: 0 20px 0 35px;
  }
  .r-slide {
    margin-left: 25px;
    margin-top: 10px;
  }
}
//小屏幕pc端
@media screen and (min-width: 992px) {
  .section {
    max-width: 970px;
    padding: 10px 30px;
  }
  .navbar {
    max-width: 1030px;
  }
}
//大屏幕pc端
@media screen and (min-width: 1200px) {
  .section {
    max-width: 1140px;
    padding: 20px 30px;
  }
  .r-slide {
    margin-left: 30px;
  }
  .navbar {
    max-width: 1200px;
  }
}
</style>
