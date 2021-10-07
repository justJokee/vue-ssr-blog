<template>
  <div class="technical">
    <loading v-if="code === 404"></loading>
    <h3 v-if="articles.technical.length === 0 && code === 200" class="none-article">还没有文章，敬请期待···</h3>
    <article-list :articleList="articles.technical"></article-list>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import articleList from '@/components/article/articleList'
import loading from '@/components/base/loading'
export default {
  components: {
    articleList,
    loading
  },
  metaInfo() {
    let title = this.$route.params.articleList
    return {
      title: title + '文章 -mapblog小站',
      meta: [{ vmid: 'description', name: 'description', content: title + '文章 -mapblog小站' }]
    }
  },
  asyncData({ store, route }) {
    return Promise.all([
      store.dispatch('getArticles', {
        publish: 1,
        page: 1,
        tag: route.params.articleList,
        cache: true
      }),
      store.dispatch('getArticlesCount', {
        publish: 1,
        page: 1,
        tag: route.params.articleList,
        cache: true
      })
    ]).then(() => {
      store.commit('changeCode', 200)
    })
  },
  beforeRouteLeave(to, from, next) {
    this.clear() //清除页码数组
    next()
  },
  beforeRouteUpdate(to, from, next) {
    //传送门模块切换时复用此组件，故重新获取数据
    this.getArticlesCount({
      publish: 1,
      page: 1,
      tag: to.params.articleList
    })
    next()
  },
  mounted() {
    Prism.highlightAll()
  },
  computed: {
    ...mapState(['articles', 'code'])
  },
  methods: {
    ...mapActions(['getArticlesCount']),
    ...mapMutations(['clear', 'changeCode'])
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.none-article {
  padding: 20px;
  // background: #F7EDED;
  background: #faf7f7;
  margin-top: 10px;
}
</style>
