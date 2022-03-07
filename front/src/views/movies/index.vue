<doc>
  @desc:   电影
  @author: justJokee 
</doc>
<template>
  <div class="movies">
    <layout _title="影视记录">
      <div class="movies__content">
        <div class="content-item" v-for="(movie, index) in movies" :key="index">
          <div class="item-pic">
            <a :href="'/app/article/'">
              <img referrerpolicy="no-referrer" v-lazy="movie.pic" alt="" />
            </a>
          </div>
          <div class="item-info">
            <div class="item-info__title">
              <a :href="'/app/article/'">
                {{ movie.title.name }}
              </a>
            </div>
            <div class="item-info__intro">演员： {{ movie.intro }}</div>
            <div class="item-info__rating">
              <span>评分：</span>
              <rating v-if="movie.rating.star" :rating="movie.rating.star"></rating>
              <div v-else>暂无评分</div>
            </div>
            <div class="item-info__date">标记时间：{{ movie.rating.date }}</div>
          </div>
        </div>
      </div>
      <div class="movies__page">
        <el-pagination
          :page-count="pageTotal"
          layout="prev, pager, next"
          :page-size="pageSize"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import rating from '@/components/rating/'
export default {
  name: 'movies',
  props: {},
  components: { rating },
  data() {
    return {
      pageTotal: 1,
      pageSize: 15,
      type: 'collect',
      movies: []
    }
  },
  async asyncData() {
    const moviesRes = await api.getMovies({ type: 'wish' })
    if (moviesRes.status === 200) return { movies: moviesRes.data, pageTotal: moviesRes.pageTotal }
  },
  mounted() {},
  computed: {},
  methods: {
    currentChange(val) {}
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
@import '~@/views/pannel/style/mixins';

.movies {
  .content-item {
    display: flex;
    padding: 16px 0;
    border-bottom: 1px dashed rgb(202, 197, 197);
  }

  .item-pic {
    flex: 0 0 auto;
    width: 80px;
    overflow: hidden;
    img {
      transition: all ease 0.38s;
      width: 100%;
      // height: 100%;
      // object-fit: cover;
    }
    img:hover {
      transform: scale(1.2);
    }
  }
  .item-info {
    font-size: 13px;
    padding-left: 16px;
    &__title {
      a {
        color: rgb(50, 118, 170);
        display: inline-block;
        transition: all ease 0.38s;
      }
      a:hover {
        transform: translateX(4px);
        text-decoration: underline;
      }
    }
    &__intro {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color: rgb(100, 99, 99);
    }
    &__rating {
      display: flex;
      align-items: center;
    }
  }
  &__page {
    margin-top: 28px;
    text-align: center;
  }
}
</style>
