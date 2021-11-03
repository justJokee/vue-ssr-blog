<doc>
  @desc:   布局 - 头部组件
  @author: justJokee 
</doc>
<template>
  <div class="header" :style="{ backgroundImage: 'url(' + headerBg + ')' }">
    <div class="header__content">
      <slot>
        头部
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'layout-header',
  props: {
    headerBg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.header {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center center;
  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.header:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @include themeify() {
    background: themed('bg-header-mask');
  }
}
</style>
