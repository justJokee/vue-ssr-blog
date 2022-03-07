<doc>
  @desc:   看板 - 本站简介
  @author: justJokee 
</doc>
<template>
  <div class="pannel-introduction">
    <el-card>网站简介</el-card>
  </div>
</template>
<script>
export default {
  name: 'pannelIntroduction',
  props: {},
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';

.pannel-introduction {
  @include pannel-frame;
}
</style>
