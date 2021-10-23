<doc>
  @desc: 首页
  @author: justJokee
</doc>
<template>
  <div class="home">
    <layout>
      <div class="home-header" slot="header">
        <div class="home-header-go" @click="go">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="article">
        <el-card>一堆文章</el-card>
      </div>
    </layout>
  </div>
</template>

<script>
// 导入工具/组件
import scrollTo from '@/utils/scrollTo'
export default {
  // 组件名称
  name: 'home',
  // 子组件
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},

  methods: {
    go() {
      const height = document.querySelector('.home-header').clientHeight
      scrollTo(height)
    }
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/index.scss';
.home {
  .home-header {
    height: 100vh;
    background-image: url(https://cdn.jsdelivr.net/gh/jerryc127/butterfly_cdn@2.1.0/top_img/index.jpg);
    background-position: center;
    background-size: cover;
    position: relative;
    .home-header-go {
      position: absolute;
      bottom: 0;
      padding: 8px 0;
      text-align: center;
      width: 100%;
      cursor: pointer;
      .el-icon-arrow-down {
        animation: dance 1.5s ease-in infinite alternate;
        font-weight: 900;
        font-size: 24px;
        @include themeify() {
          color: themed('color-navbar');
        }
      }
    }
  }
  .article {
    height: 2500px;
  }
}
@keyframes dance {
  from {
    opacity: 0.6;
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}
</style>
