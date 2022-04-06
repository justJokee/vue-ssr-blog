<doc>
  @desc:   看板 - 本站简介
  @author: justJokee 
</doc>
<template>
  <div class="pannel-introduction">
    <el-card>
      <site-introduction></site-introduction>
    </el-card>
  </div>
</template>
<script>
import siteIntroduction from '@/views/components/site-introduction'
export default {
  name: 'pannelIntroduction',
  components: {
    siteIntroduction
  },
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
  transition: all ease 0.38s;
  margin-bottom: 16px;
  @include pannel-frame;
  @include respond-to(xs) {
    display: none;
  }
}
</style>
