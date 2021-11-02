<doc>
  @desc:   布局 - 头部组件
  @author: justJokee 
</doc>
<template>
  <div class="layout-header" :style="{ background: 'url(' + headerBg + ')' }">
    头部
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
.layout-header {
  height: 400px;
  background-size: 100% 100%;
  background-position: center;
}
</style>
