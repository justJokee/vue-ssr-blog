<doc>
  @desc:   文章上/下一篇
  @author: justJokee
</doc>
<template>
  <div class="prev-next">
    <div class="prev-next__content">
      <div class="content__prev" v-if="prevnext.prev">
        <a :href="getHref('prev')">
          <img :src="prevnext.prev.headerPic" alt="" />
          <div class="content__info">
            <div>上一篇</div>
            <div>{{ this.prevnext.prev.title }}</div>
          </div>
        </a>
      </div>
      <div class="content__next" v-if="prevnext.next">
        <a :href="getHref('next')">
          <img :src="prevnext.next.headerPic" alt="" />
          <div class="content__info">
            <div>下一篇</div>
            <div>{{ this.prevnext.next.title }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'prevnext',
  props: {
    article: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      prevnext: {}
    }
  },
  mounted() {
    this.getPrevnextArticle()
  },
  components: {},
  methods: {
    async getPrevnextArticle() {
      const prevnextRes = await this.$api.getPrevnextArticle({
        createTime: this.article.createTime
      })
      if (prevnextRes.status === 200) {
        console.log('p-next=====', prevnextRes)
        this.prevnext = prevnextRes.data
      }
    },
    getHref(type) {
      if (type === 'prev') return `/app/article/${this.prevnext.prev.articleId}`
      else return `/app/article/${this.prevnext.next.articleId}`
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.prev-next {
  &__content {
    position: relative;
    height: 150px;
    @include flex-box-space;
    .content__prev,
    .content__next {
      width: 50%;
      height: 100%;
      flex-grow: 1;
      a {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      a:before {
        content: '';
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        transition: all ease-in 0.38s;
      }
      img {
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: all ease 0.38s;
      }
      a:hover:before {
        background: rgba(0, 0, 0, 0.2);
      }
      a:hover img {
        transform: scale(1.2);
      }
    }
    .content__prev .content__info {
      text-align: left;
    }
    .content__next .content__info {
      text-align: right;
    }
    .content__info {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 38px;
      @include themeify() {
        color: themed('color-title');
      }
    }
  }
}
</style>
