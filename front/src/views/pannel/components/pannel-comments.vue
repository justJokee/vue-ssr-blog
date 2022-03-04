<doc>
  @desc:   看板 - 最新文章评论
  @author: justJokee 
</doc>
<template>
  <div class="pannel-comments">
    <el-card>
      <div class="pannel__item-content">
        <div class="pannel__item-title">
          <i class="el-icon-"></i>
          <span>最新评论</span>
        </div>
        <div class="pannel__item-body"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'pannelComments',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['newComments'])
  },
  methods: {}
}
</script>
<style lang="scss">
.pannel-comments {
}
</style>
