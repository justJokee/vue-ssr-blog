<doc>
  @desc:   看板 - 文章归档
  @author: justJokee 
</doc>
<template>
  <div class="pannel-archives">
    <el-card>
      <div class="pannel__item-title">
        <i class="el-icon-takeaway-box"></i>
        <span>归档</span>
      </div>
      <div class="pannel__item-body">
        <ul v-if="archives.length">
          <li v-for="(archive, index) in archives" :key="index" @click="filterArchives(archive)">
            <span>{{ archive.month }}</span>
            <span>{{ archive.total }}</span>
          </li>
        </ul>
        <empty v-else></empty>
      </div>
    </el-card>
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
  computed: {
    ...mapState(['archives'])
  },
  methods: {
    filterArchives(archive) {
      this.$router.push({
        name: 'archives',
        query: {
          filter: archive.month
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';

.pannel-archives {
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
