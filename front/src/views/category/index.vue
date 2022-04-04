<doc>
  @desc:   分类
  @author: justJokee 
</doc>
<template>
  <div class="category">
    <layout _title="分类">
      <div class="category__content">
        <ul>
          <li v-for="(item, index) in categories" :key="index" @click="filterArticles(item.name, item._id)">
            <div>
              <dot>
                <span>{{ item.name }}</span>
                <span>（{{ item.total }}）</span>
              </dot>
            </div>
          </li>
        </ul>
      </div>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import dot from '@/components/dot'
export default {
  name: 'category',
  metaInfo() {
    return {
      title: `文章分类  - Marco's Blog`,
      meta: [
        {
          name: 'description',
          content: '文章分类'
        },
        {
          name: 'keywords',
          content: '技术文档，生活感悟'
        }
      ]
    }
  },
  data() {
    return {
      categories: []
    }
  },
  components: { dot },
  async asyncData() {
    const categoryRes = await api.getCategory({})
    if (categoryRes.status === 200) return { categories: categoryRes.data }
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
.category {
  &__content {
    li {
      padding: 6px 0;
      transition: all ease 0.38s;
    }
    li:hover {
      cursor: pointer;
      @include themeify() {
        color: themed('color-ele-primary');
      }
    }
  }
}
</style>
