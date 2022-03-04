<doc>
  @desc:   看板 - 最新文章
  @author: justJokee 
</doc>
<template>
  <div class="pannel-articles">
    <el-card>
      <div class="pannel__item-content">
        <div class="pannel__item-title">
          <i class="el-icon el-icon-s-order"></i>
          <span>最新文章</span>
        </div>
        <div class="pannel__item-body">
          <div class="body-item" v-for="(article, index) in newArticles" :key="index">
            <div class="body-pic">
              <router-link :to="'/app/article/' + article.articleId">
                <img v-lazy="article.headerPic" alt="" />
              </router-link>
            </div>
            <div class="body-info">
              <div class="body-info__title">
                <router-link :to="'/app/article/' + article.articleId">
                  {{ article.title }}
                </router-link>
              </div>
              <div class="body-info__date">{{ article.createTime | formatDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'pannelArticles',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['newArticles'])
  },
  methods: {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.pannel-articles {
  .pannel__item-content {
  }
  .pannel__item-title {
  }
  .pannel__item-body {
    .body-item {
      display: flex;
      padding: 8px 0;
    }
    .body-pic {
      flex: 0 0 auto;
      width: 60px;
      height: 60px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .body-info {
      margin-left: 12px;
      &__title a {
        transition: all 0.38s ease-in-out;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      &__title:hover a,
      &__title:hover {
        @include themeify() {
          color: themed('color-ele-primary');
        }
      }
      &__date {
        @include themeify() {
          color: themed('color-home-article-detail');
        }
        padding: 8px 0;
      }
    }
  }
}
</style>
