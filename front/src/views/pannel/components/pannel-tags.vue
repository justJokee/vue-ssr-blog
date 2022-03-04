<doc>
  @desc:   看板 - 文章标签
  @author: justJokee 
</doc>
<template>
  <div class="pannel-tags">
    <el-card>网站简介</el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'pannelTags',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['tags'])
  },
  methods: {}
}
</script>
<style lang="scss">
.pannel-tags {
}
</style>
