<doc>
  @desc:   navbar 适配移动端
  @author: justJokee 
</doc>
<template>
  <div class="vertical-navbar">
    <div class="vertical-navbar__intro">
      <div class="intro__avatar">
        <img src="https://avatars.githubusercontent.com/u/35912907?v=4" alt="" />
      </div>
      <div class="intro__totals">
        <div>
          <div>文章</div>
          <div>{{ totals.article }}</div>
        </div>
        <div>
          <div>分类</div>
          <div>{{ totals.category }}</div>
        </div>
        <div>
          <div>标签</div>
          <div>{{ totals.tag }}</div>
        </div>
      </div>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect">
      <el-menu-item index="home">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-discover"></i>
          <span>导航</span>
        </template>
        <el-menu-item index="archives">
          <i class="el-icon-files"></i>
          <span>归档</span>
        </el-menu-item>
        <el-menu-item index="tags">
          <i class="el-icon-collection-tag"></i>
          <span>标签</span>
        </el-menu-item>
        <el-menu-item index="category">
          <i class="el-icon-folder-opened"></i>
          <span>分类</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-camera"></i>
          <span>娱乐</span>
        </template>
        <el-menu-item index="movies">
          <i class="el-icon-video-camera-solid"></i>
          <span>电影</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="messageBoard">
        <i class="el-icon-chat-dot-round"></i>
        <span>留言板</span>
      </el-menu-item>
      <el-menu-item index="4" @click="friendLink">
        <i class="el-icon-ship"></i>
        <span>友链</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['totals']),
    activeIndex() {
      return this.$route.name
    }
  },
  methods: {
    handleSelect(val) {
      this.$emit('goTo', val)
    },
    friendLink() {
      this.$message({
        message: '拼命开发中😭'
      })
    }
  }
}
</script>
<style lang="scss">
.vertical-navbar {
  &__intro {
    .intro__avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transition: all ease 0.38s;
      }
      img:hover {
        transform: rotate(360deg);
      }
    }
    .intro__totals {
      margin-top: 12px;
      padding: 0 24px;
      text-align: center;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
