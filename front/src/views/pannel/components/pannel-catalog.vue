<doc>
  @desc:   看板 - 文章目录树
  @author: justJokee 
</doc>
<template>
  <div class="pannel-catalog">
    <el-card>
      <tree-folder :catalogs="catalogs"></tree-folder>
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
.pannel-catalog {
  .el-card__body {
    > ol {
      padding: 0;
    }
  }
  ol {
    padding-left: 12px;
  }
}
</style>
