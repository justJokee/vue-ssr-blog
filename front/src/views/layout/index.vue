<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <div class="layout">
    <header class="layout__header">
      <navbar></navbar>
      <slot name="header">
        <div class="header-content">
          <layout-header v-bind="$attrs"></layout-header>
        </div>
      </slot>
    </header>
    <main class="layout__body">
      <div class="layout__body-content">
        <div class="layout__body-page">
          <slot>
            <el-card>page....</el-card>
          </slot>
        </div>
        <div v-if="dashboardShow" class="layout__body-dashboard">
          <dashboard></dashboard>
        </div>
      </div>
    </main>
    <footer class="layout__footer">
      <slot name="footer">
        <div class="layout__footer-content">尾部</div>
      </slot>
    </footer>
  </div>
</template>
<script>
import navbar from '@/views/layout/components/navbar/'
import layoutHeader from '@/views/layout/components/header/'

import dashboard from './components/dashboard/'

export default {
  props: {
    dashboardShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    dashboard,
    layoutHeader,
    navbar
  },

  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__header {
    min-height: 150px;
  }
  &__body {
    &-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 auto;
      padding: 40px 15px;
    }
    &-page {
      flex: 0 1 auto;
      width: 75%;
    }
    &-dashboard {
      // height: auto;
      height: 1500px;
      flex: 1 1 auto;
      width: 25%;
      border: 4px solid #ccc;
      margin-left: 16px;
    }
    @include respond-to(xs) {
      &-content {
        max-width: 768px;
        flex-direction: column;
        padding: 20px 5px;
      }
      &-page {
        width: 100%;
      }
      &-dashboard {
        width: 100%;
        margin-left: 0;
      }
    }
    @include respond-to(md) {
      &-content {
        max-width: 992px;
      }
    }
    @include respond-to(lg) {
      &-content {
        max-width: 1200px;
      }
    }
  }
  &-footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
