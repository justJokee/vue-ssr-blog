<doc>
  @desc:   按条件搜索文章列表
  @author: justJokee 
</doc>
<template>
  <div class="article-filter">
    <layout :_title="title">
      <template slot="custom-body">
        <article-iterator :articles="articles"></article-iterator>
        <div class="article-filter__page">
          <el-pagination
            :total="total"
            layout="prev, pager, next"
            :page-size="pageSize"
            @current-change="currentChange"
          ></el-pagination>
        </div>
      </template>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import articleIterator from '@/views/components/article-iterator'

// 筛选文章公共请求
async function fetchArticles(route, page) {
  const params = { publish: 1, ...page }
  // 按标签筛选
  if (route.params.type === 'tag') params.tag = route.params.param
  // 按分类筛选
  if (route.params.type === 'category') params.categoryId = route.params.param

  const articleRes = await api.getArticles(params, { page: 1, limit: 10 })
  return articleRes
}

export default {
  name: 'articleFilter',
  metaInfo() {
    return {
      title: `文章筛选：${this.title}  - Marco's Blog`,
      meta: [
        {
          name: 'description',
          content: `${this.title}类文章`
        },
        {
          name: 'keywords',
          content: `${this.title}`
        }
      ]
    }
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      articles: [],
      total: []
    }
  },
  created() {},
  components: { articleIterator },
  async asyncData({ route }) {
    const articleRes = await fetchArticles(route)
    if (articleRes.status === 200) return { articles: articleRes.data, total: articleRes.total }
  },
  computed: {
    title() {
      if (this.$route.params.type === 'category') return this.$route.query.name
      return this.$route.params.param
    }
  },
  methods: {
    currentChange(val) {
      this.currentPage = val
      this.getArticles()
    },
    async getArticles() {
      const articleRes = await fetchArticles(this.$route, { page: this.currentPage, limit: this.pageSize })
      if (articleRes.status === 200) {
        this.articles = articleRes.data
        this.total = articleRes.total
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.article-filter {
  &__page {
    padding: 12px;
    @include flex-box-center;
  }
}
</style>
