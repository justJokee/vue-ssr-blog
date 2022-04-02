<doc>
  @desc:   看板 - 最新文章评论
  @author: justJokee 
</doc>
<template>
  <div class="pannel-comments">
    <el-card>
      <div class="pannel__item-content">
        <div class="pannel__item-title">
          <i class="el-icon-chat-dot-square"></i>
          <span>最新评论</span>
        </div>
        <div class="pannel__item-body">
          <div class="body-item" v-for="(comment, index) in newComments" :key="index">
            <div class="body-pic">
              <router-link :to="'/app/article/' + comment.articleId + '?anchor=a_cm'">
                <img v-lazy="comment.imgUrl" alt="" />
              </router-link>
            </div>
            <div class="body-info">
              <div class="body-info__title">
                <router-link :to="'/app/article/' + comment.articleId + '?anchor=a_cm'">
                  {{ comment.content }}
                </router-link>
              </div>
              <div class="body-info__name">{{ comment.name }}</div>
              <div class="body-info__date">发表于：{{ comment.date | formatDate }}</div>
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
  name: 'pannelComments',
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['newComments'])
  },
  methods: {}
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';

.pannel-comments {
  @include articles-comments;
  .body-info {
    &__title a {
      -webkit-line-clamp: 1 !important;
    }
    &__name {
      padding-top: 4px;
      @include clamp(1);
    }
    &__date {
      padding: 2px 0 !important;
    }
  }
}
</style>
