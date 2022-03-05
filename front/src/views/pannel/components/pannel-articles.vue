<doc>
  @desc:   看板 - 最新文章
  @author: justJokee 
</doc>
<template>
  <div class="pannel-articles">
    <el-card>
      <div class="pannel__item-content">
        <div class="pannel__item-title">
          <i class="el-icon-document"></i>
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
@import '~@/views/pannel/style/mixins';

.pannel-articles {
  @include articles-comments;
}
</style>
