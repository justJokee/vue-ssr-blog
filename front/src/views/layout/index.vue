<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <div class="layout">
    <header class="layout-header">
      <navbar></navbar>
      <slot name="header">
        <div class="header-content">头部组件</div>
      </slot>
    </header>
    <main class="layout-body">
      <div class="body-content">
        <div class="body-content-page">
          <slot>
            <el-card>page....</el-card>
          </slot>
        </div>
        <div v-if="dashboardShow" class="body-content-dashboard">
          <dashboard></dashboard>
        </div>
      </div>
    </main>
    <footer class="layout-footer">
      <slot name="footer">
        <div class="footer-content">尾部</div>
      </slot>
    </footer>
  </div>
</template>
<script>
import navbar from '@/views/layout/components/navbar/'

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

  .layout-header {
    min-height: 150px;
    // padding-top: 60px;
  }
  .layout-body {
    .body-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 auto;
      padding: 8px;
      .body-content-page {
        flex: 0 1 auto;
        width: 75%;
      }
      .body-content-dashboard {
        height: auto;
        flex: 1 1 auto;
        width: 25%;
        border: 4px solid #ccc;
        margin-left: 16px;
      }
    }
    @include respond-to(xs) {
      .body-content {
        max-width: 768px;
        flex-direction: column;
        .body-content-page {
          width: 100%;
        }
        .body-content-dashboard {
          width: 100%;
          margin-left: 0;
        }
      }
    }
    @include respond-to(md) {
      .body-content {
        max-width: 992px;
      }
    }
    @include respond-to(lg) {
      .body-content {
        max-width: 1200px;
      }
    }
  }
  .layout-footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
