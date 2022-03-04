<doc>
  @desc:   看板 - 文章归档
  @author: justJokee 
</doc>
<template>
  <div class="pannel-archives">
    <el-card>网站简介</el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'pannelArchives',
  props: {},
  data() {
    return {}
  },
  compouted: {
    ...mapState(['archives'])
  },
  methods: {}
}
</script>
<style lang="scss">
.pannel-archives {
}
</style>
