<doc>
  @desc:   看板 - 文章分类
  @author: justJokee 
</doc>
<template>
  <div class="pannel-category">
    <el-card>网站简介</el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'pannelCategory',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['category'])
  },
  methods: {}
}
</script>
<style lang="scss">
.pannel-category {
}
</style>
