<doc>
  @desc:   文章列表迭代器
  @author: justJokee 
</doc>
<template>
  <div class="article-iterator">
    <el-card class="article-iterator__item" v-for="(article, index) in articles" :key="index">
      <div class="article-iterator__item-content">
        <div class="article-iterator__item-pic">
          <img :src="article.headerPic" alt="" />
        </div>
        <div class="article-iterator__item-info">
          <div>
            <router-link :to="'/app/article/' + article.articleId">{{ article.title }}</router-link>
          </div>
          <div class="article-iterator__item-detail">
            <span>
              <i class="el-icon-date"></i>
              发表时间 {{ article.createTime | formatDate }}
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
          <div class="article-iterator__item-abstract">{{ article.abstract }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'articleIterator',
  props: {
    articles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.article-iterator {
  &__item {
    height: 280px;
    > .el-card__body {
      width: 100%;
      height: 100%;
      padding: 0;
    }
    &-pic {
      width: 45%;
      height: 100%;
      flex: 0 0 auto;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &-info {
      width: 55%;
      padding: 20px 30px;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-detail {
      @include themeify() {
        color: themed('color-home-article-detail');
      }
      font-size: 12px;
      padding: 12px 0;
    }
    &-abstract {
      line-height: 2;
    }
  }
  &__item-content {
    display: flex;
    width: 100%;
    height: 100%;
    a {
      font-size: 24px;
      line-height: 1.5;
      transition: all ease-in-out 0.25s;
    }
    a:hover {
      @include themeify() {
        color: themed('color-ele-primary');
      }
    }
  }
  &__item:not(:first-child) {
    margin-top: 20px;
  }
  &__item:nth-child(even) .article-iterator__item-pic {
    order: 2;
  }
}
</style>
