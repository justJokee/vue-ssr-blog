<doc>
  @desc:   navbar
  @author: justJokee 
</doc>
<template>
  <nav class="navbar" :class="{ 'navbar-rollup': rollBack, 'navbar-transparent': rollbackTop }">
    <div class="navbar__name">Marco's Blog</div>
    <div class="navbar__menus">
      <horizontal-navbar @goTo="goTo" @openSearch="openSearch"></horizontal-navbar>
      <div class="vertical-menu-trigger">
        <div class="navbar-menu" @click="openSearch">
          <i class="el-icon-search"></i>
          <span>搜索</span>
        </div>
        <i class="el-icon-menu" @click="drawer = true"></i>
      </div>
    </div>
    <el-dialog
      title="搜索"
      :visible.sync="searchVisible"
      :style="{ minWidth: '340px' }"
      width="30%"
      :append-to-body="true"
      :lock-scroll="false"
      custom-class="search-box"
    >
      <search @hasJumped="closeSearch"></search>
    </el-dialog>
    <el-drawer :append-to-body="true" :size="300" :visible.sync="drawer" direction="rtl">
      <vertical-navbar @goTo="goTo"></vertical-navbar>
    </el-drawer>
  </nav>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getScrollTop } from '@/utils/getScrollTop'
import search from '@/views/components/search'
import horizontalNavbar from './horizontal-navbar'
import verticalNavbar from './vertical-navbar'
export default {
  name: 'navbar',
  props: {},
  components: { search, horizontalNavbar, verticalNavbar },
  data() {
    return {
      lastTopPos: 0,
      rollbackTop: false,
      searchVisible: false,
      drawer: false
    }
  },
  mounted() {
    if (getScrollTop() == 0) this.rollbackTop = true
    window.addEventListener(
      'scroll',
      () => {
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
  @include respond-to(xs) {
    padding: 0 16px;
  }
  &__menus {
    display: flex;
    align-items: center;
  }
  .vertical-menu-trigger {
    display: none;
  }
  @include respond-to(xs) {
    .horizontal-navbar {
      display: none;
    }
    .vertical-menu-trigger {
      display: flex;
      align-items: center;
      > i {
        font-size: 18px;
        margin-left: 12px;
      }
      .el-icon-search {
        margin-right: 8px;
      }
    }
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
