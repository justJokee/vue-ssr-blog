<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <ol class="tree-folder">
    <li v-for="(catalog, index) in catalogs" :key="catalog.level + '_' + index">
      <div class="tree-folder__content">
        <div class="tree-folder__order">
          <span v-if="catalog.level_tree">{{ curIndex + 1 + '.' + (index + 1) }}</span>
          <span v-else>{{ index + 1 }}.</span>
        </div>
        <span>{{ catalog.name }}</span>
      </div>

      <tree-folder
        v-if="catalog.children && catalog.children.length"
        :catalogs="catalog.children"
        :curIndex="index"
      ></tree-folder>
    </li>
  </ol>
</template>
<script>
export default {
  name: 'tree-folder',
  props: {
    curIndex: {
      type: Number,
      default: 0
    },
    catalogs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
.tree-folder {
  &__content {
    padding: 4px;
  }
  &__order {
    display: inline-block;
    margin-right: 8px;
  }
}
</style>
