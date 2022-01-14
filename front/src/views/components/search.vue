<doc>
  @desc:   文章搜索
  @author: justJokee
</doc>
<template>
  <div class="search">
    <el-scrollbar>
      <div class="search__body">
        <div class="search__input">
          <el-input size="small">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="search__content"></div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  name: 'search',
  props: {},
  data() {
    return {
      artices: []
    }
  },
  components: {},
  methods: {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.search {
  &__body {
    width: 100%;
    height: 200px;
  }
}
.search-box {
  border-radius: 8px;
  .el-dialog__body {
    padding-top: 0;
  }
}
</style>
