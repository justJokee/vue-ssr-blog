<doc>
  @desc:   布局 - 头部组件
  @author: justJokee 
</doc>
<template>
  <div class="header" :style="{ backgroundImage: 'url(' + headerBg + ')' }">
    <div class="header__content">
      <slot>
        <div class="header__default-title">
          <h1>{{ _title }}</h1>
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'layout-header',
  props: {
    headerBg: {
      type: String
      // default: ''
    },
    _title: {
      type: String,
      default: '标题'
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
  &__default-title {
    width: 100%;
    height: 100%;
    font-size: 20px;
    color: #fff;
    @include flex-box-center;
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
