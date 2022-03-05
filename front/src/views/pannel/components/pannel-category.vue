<doc>
  @desc:   看板 - 文章分类
  @author: justJokee 
</doc>
<template>
  <div class="pannel-category">
    <el-card>
      <div class="pannel__item-title">
        <i class="el-icon-c-scale-to-original"></i>
        <span>文章分类</span>
      </div>
      <div class="pannel__item-body">
        <ul>
          <li v-for="(item, index) in category" :key="index" @click="filterArticles(item.name, item._id)">
            <span>{{ item.name }}</span>
            <span>{{ item.total }}</span>
          </li>
        </ul>
      </div>
    </el-card>
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
  methods: {
    filterArticles(name, _id) {
      this.$router.push({
        name: 'articleFilter',
        params: {
          type: 'category',
          param: _id
        },
        query: {
          name
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';
.pannel-category {
  @include pannel-frame;
  .pannel__item-body {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      transition: all ease 0.38s;
    }
    li:hover {
      padding: 8px 12px;
      @include themeify() {
        background: themed('color-list-hover');
      }
    }
  }
}
</style>
