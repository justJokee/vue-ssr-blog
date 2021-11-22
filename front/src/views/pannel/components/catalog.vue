<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <div class="catalog">
    <el-card>
      <tree-folder :catalogs="catalogs"></tree-folder>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import treeFolder from './tree-folder.vue'

export default {
  name: 'catalog',
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
.catalog {
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
