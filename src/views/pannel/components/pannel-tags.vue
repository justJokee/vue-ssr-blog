<doc>
  @desc:   看板 - 文章标签
  @author: justJokee 
</doc>
<template>
  <div class="pannel-tags">
    <el-card>
      <div class="pannel__item-title">
        <i class="el-icon-collection-tag"></i>
        <span>标签</span>
      </div>
      <div class="pannel__item-body">
        <tags-iterator :tags="tags" size="small"></tags-iterator>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import tagsIterator from '@/views/components/tags-iterator'

export default {
  name: 'pannelTags',
  props: {},
  components: { tagsIterator },
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
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';
.pannel-tags {
  @include pannel-frame;
}
</style>
