<doc>
  @desc:   看板 - 文章目录树
  @author: justJokee 
</doc>
<template>
  <div class="pannel-catalog">
    <el-card>
      <div class="pannel__item-title">
        <i class="el-icon-folder-opened"></i>
        <span>目录</span>
      </div>
      <div class="pannel__item-body">
        <tree-folder :catalogs="catalogs"></tree-folder>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import treeFolder from './tree-folder.vue'

export default {
  name: 'pannelCatalog',
  props: {},
  components: {
    treeFolder
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    ...mapState(['catalogs'])
  },
  methods: {},
  destroyed() {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';
.pannel-catalog {
  @include pannel-frame;

  .pannel__item-body {
    > ol {
      padding: 0;
    }
  }
}
</style>
