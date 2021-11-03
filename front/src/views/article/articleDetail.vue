<doc>
  @desc: 文章详情
  @author: justJokee
</doc>
<template>
  <div class="article-detail">
    <layout :headerBg="article.headerPic">
      <div class="article-detail__header" slot="custom-header">
        <h1 class="article-detail__title">{{ article.title }}</h1>
        <div class="article-detail__info info-1">
          <span>
            <i class="el-icon-date"></i>
            发表时间 {{ article.date | formatDate }}
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span>
            <i class="el-icon-price-tag"></i>
            标签 {{ article.tag.join('&nbsp;&nbsp;') }}
          </span>
        </div>
        <div class="article-detail__info info-2">
          <span>
            <i class="el-icon-chat-dot-round"></i>
            阅读量 {{ article.pv }}
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span>
            <i class="el-icon-chat-dot-round"></i>
            评论数 {{ article.commentNum }}
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span>
            <i class="el-icon-star-off"></i>
            点赞 {{ article.likeNum }}
          </span>
        </div>
      </div>
      <div v-html="article.content" class="article-detail__body"></div>
    </layout>
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
  mounted() {
    this.$nextTick(function() {
      Prism.highlightAll()
    })
  },
  updated() {},
  async asyncData({ route }) {
    const articleRes = await api.getArticle({
      publish: 1,
      articleId: route.params.id
    })
    if (articleRes.status === 200) return { article: articleRes.data }
  },
  methods: {
    getDemo() {}
  },
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/index.scss';
.article-detail {
  &__header {
    width: 100%;
    height: 100%;
    @include flex-box-center;
    flex-direction: column;
  }
  &__body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Lato, Roboto, 'PingFang SC',
      'Microsoft JhengHei', 'Microsoft YaHei', sans-serif;
    line-height: 2;
    color: #4c4948;
  }
  &__title {
    @include themeify() {
      color: themed('color-title');
    }
  }
  &__info {
    @include themeify() {
      color: themed('color-navbar');
    }
  }
  .info-2 {
    margin-top: 8px;
  }
}
</style>
