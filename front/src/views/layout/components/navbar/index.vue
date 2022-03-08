<doc>
  @desc:   navbar
  @author: justJokee 
</doc>
<template>
  <nav class="navbar" :class="{ 'navbar-rollup': rollBack, 'navbar-transparent': rollbackTop }">
    <div class="navbar-name">Marco's Blog</div>
    <div class="navbar-menus">
      <div class="navbar-menu" @click="openSearch">
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </div>
      <div class="navbar-menu" @click="goTo('home')">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-discover"></i>
          导航
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="menu-list">
          <el-dropdown-item @click.native="goTo('archives')">
            <i class="el-icon-files"></i>
            归档
          </el-dropdown-item>
          <el-dropdown-item @click.native="goTo('tags')">
            <i class="el-icon-collection-tag"></i>
            标签
          </el-dropdown-item>
          <el-dropdown-item @click.native="goTo('category')">
            <i class="el-icon-folder-opened"></i>
            分类
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-notebook-2"></i>
          文档
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="menu-list">
          <el-dropdown-item></el-dropdown-item>
          <el-dropdown-item></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-camera"></i>
          娱乐
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="menu-list">
          <el-dropdown-item @click.native="goTo('movies')">
            <i class="el-icon-video-camera-solid"></i>
            电影
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="navbar-menu" @click="goTo('messageBoard')">
        <i class="el-icon-chat-dot-round"></i>
        <span>留言板</span>
      </div>
      <div class="navbar-menu" @click="friendLink">
        <i class="el-icon-ship"></i>
        <span>友链</span>
      </div>
    </div>
    <el-dialog
      title="搜索"
      :visible.sync="searchVisible"
      width="30%"
      :append-to-body="true"
      :lock-scroll="false"
      custom-class="search-box"
    >
      <search @hasJumped="closeSearch"></search>
    </el-dialog>
  </nav>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getScrollTop } from '@/utils/getScrollTop'
import search from '@/views/components/search'
export default {
  name: 'navbar',
  props: {},
  components: { search },
  data() {
    return {
      lastTopPos: 0,
      rollbackTop: false,
      searchVisible: false
    }
  },
  mounted() {
    if (getScrollTop() == 0) this.rollbackTop = true
    window.addEventListener(
      'scroll',
      e => {
        const nowTopPos = getScrollTop()
        if (nowTopPos - this.lastTopPos > 0) {
          this.setRollBack(false)
          this.rollbackTop = false
        } else if (nowTopPos == 0) {
          this.rollbackTop = true
        } else this.setRollBack(true)
        this.lastTopPos = nowTopPos
      },
      false
    )
  },
  computed: {
    ...mapState(['rollBack'])
  },
  methods: {
    ...mapMutations(['setRollBack']),
    goTo(name) {
      this.$router.push({ name })
    },
    // 文章关键词搜索
    openSearch() {
      this.searchVisible = true
    },
    closeSearch() {
      this.searchVisible = false
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
@import '~@/style/index.scss';
.navbar {
  width: 100%;
  height: 60px;
  background: transparent;
  position: fixed;
  top: -60px;
  z-index: 1200;
  transition: all ease 0.38s;
  text-align: right;
  padding: 0 36px;
  @include flex-box-space;
  @include themeify() {
    color: themed('color-navbar');
  }
  .navbar-menu {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
    position: relative;
    [class^='el-icon-'] {
      font-weight: 900;
      margin-right: 4px;
      font-size: 15px;
    }
    @include themeify() {
      color: themed('color-navbar');
    }
    .navbar-menu-title {
      .el-icon-arrow-down {
        display: inline-block;
        transition: all ease 0.38s;
      }
    }
    .navbar-menu-title:hover {
      .el-icon-arrow-down {
        transform: rotate(180deg);
      }
    }
  }
  .navbar-menu:hover.navbar-menu:after {
    width: 100%;
  }
  .navbar-menu:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 3px;
    background: #80c8f8;
    display: inline-block;
    transition: all ease 0.38s;
  }
}
.menu-list {
  [class^='el-icon-'] {
    font-weight: 900;
    margin-right: 4px;
    font-size: 16px;
  }
  .popper__arrow {
    display: none;
  }
}
.navbar-rollup {
  position: fixed;
  transform: translateY(100%);
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
  .navbar-menu {
    @include themeify() {
      color: themed('color-navbar-rollup-color');
    }
  }
  @include themeify() {
    color: themed('color-navbar-rollup-color');
    background: themed('color-navbar-rollup-bg');
  }
}
.navbar-transparent {
  transform: translateY(100%);
  background: transparent;
  box-shadow: none;
  @include themeify() {
    color: themed('color-navbar');
  }
  .navbar-menu {
    @include themeify() {
      color: themed('color-navbar');
    }
  }
}
</style>
