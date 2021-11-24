<doc>
  @desc:   navbar
  @author: justJokee 
</doc>
<template>
  <nav class="navbar" :class="{ 'navbar-rollup': rollBack, 'navbar-transparent': rollbackTop }">
    <div class="navbar-name">mapblog</div>
    <div class="navbar-menus">
      <div class="navbar-menu">
        <i class="el-icon-search"></i>
        <span>搜索</span>
      </div>
      <div class="navbar-menu">
        <i class="el-icon-s-home"></i>
        <span>首页</span>
      </div>
      <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-discover"></i>
          导航
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="navbar-menus-dropdown-menu">
          <el-dropdown-item>黄金糕</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-notebook-2"></i>
          文档
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="navbar-menus-dropdown-menu">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>黄金糕</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="navbar-menu">
        <span class="navbar-menu-title">
          <i class="el-icon-camera"></i>
          娱乐
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="navbar-menus-dropdown-menu">
          <el-dropdown-item>黄金糕</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="navbar-menu">
        <i class="el-icon-chat-dot-round"></i>
        <span @click="goTo('messageBoard')">留言板</span>
      </div>
      <div class="navbar-menu">
        <i class="el-icon-ship"></i>
        <span>友链</span>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getScrollTop } from '@/utils/getScrollTop'

export default {
  name: 'navbar',
  props: {},
  data() {
    return {
      lastTopPos: 0,
      rollbackTop: false
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
.navbar-menus-dropdown-menu {
  .popper__arrow {
    display: none;
  }
}
</style>
