<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <div class="layout">
    <header class="layout__header">
      <navbar></navbar>
      <slot name="header">
        <div class="layout__header-content">
          <layout-header v-bind="$attrs">
            <slot name="custom-header"></slot>
          </layout-header>
        </div>
      </slot>
    </header>
    <main class="layout__body">
      <div class="layout__body-content">
        <div class="layout__body-page">
          <slot name="custom-body">
            <el-card class="layout__body-default">
              <slot></slot>
            </el-card>
          </slot>
        </div>
        <div v-if="pannelShow" class="layout__body-pannel">
          <pannel></pannel>
          <div style="border-top: 1px solid red;width:150%"></div>
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

import pannel from '@/views/pannel/'

export default {
  props: {
    pannelShow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    pannel,
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
      // align-items: flex-start;
      margin: 0 auto;
      padding: 40px 15px;
    }
    &-page {
      flex: 0 1 auto;
      width: 75%;
      .el-card {
        box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.06);
        border-radius: 8px;
      }
    }
    &-default {
      .el-card__body {
        padding: 50px 40px;
      }
    }
    &-pannel {
      flex: 1 1 auto;
      width: 25%;
      // border: 4px solid #ccc;
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
      &-pannel {
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
