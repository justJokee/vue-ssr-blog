<doc>
  @desc: 文章详情
  @author: justJokee
</doc>
<template>
  <div class="article-detail">
    <layout :headerBg="'http://'"></layout>
  </div>
</template>

<script>
import api from '@/api/'

export default {
  name: 'articleDetail',
  components: {},
  props: {},
  // 动态属性
  data() {
    return {
      article: {}
    }
  },
  computed: {},
  watch: {},
  filters: {},
  mounted() {},
  updated() {},
  async asyncData({ route }) {
    console.log('这是route===》》》》', route)
    const articleRes = await api.getArticle({
      publish: 1,
      articleId: route.params.id
    })
    if (articleRes.status === 200) return { articles: articleRes.data, total: articleRes.total }
  },
  methods: {
    getDemo() {}
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/index.scss';
.articleDetail {
}
</style>
