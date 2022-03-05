<doc>
  @desc:   归档
  @author: justJokee 
</doc>
<template>
  <div class="archives">
    <layout _title="归档">
      <div class="archives__year" v-for="(range, index) in archives" :key="index">
        <div class="year-text">{{ range.year || range.month }}</div>
        <el-timeline>
          <el-timeline-item
            v-for="(article, mi) in range.months"
            :key="'art_' + mi"
            type="primary"
            :hide-timestamp="true"
          >
            <div class="archives__content">
              <div class="content-left">
                <router-link :to="'/app/article/' + article.articleId">
                  <img v-lazy="article.headerPic" alt="" />
                </router-link>
              </div>
              <div class="content-right">
                <div class="content-right__title">
                  <router-link :to="'/app/article/' + article.articleId">
                    {{ article.title }}
                  </router-link>
                </div>
                <div class="content-right__date">
                  <i class="el-icon-date"></i>
                  {{ article.createTime | formatDate }}
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="archives__page">
        <el-pagination
          :total="total"
          layout="prev, pager, next"
          :page-size="limit"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'

async function getArchiveRes(route, page = 1, limit = 10) {
  const params = {
    limit,
    page
  }
  if (route.query.filter && /(\d+)-(\d+)/.test(route.query.filter)) {
    params.filter = 1
    params.month = route.query.filter
  }

  const archiveRes = await api.getArchives(params)
  return archiveRes
}

export default {
  name: 'archives',
  data() {
    return {
      currentPage: 1,
      limit: 20,
      total: 0,
      archives: []
    }
  },
  async asyncData({ route }) {
    const archiveRes = await getArchiveRes(route)
    if (archiveRes.status === 200) return { archives: archiveRes.data, total: archiveRes.total }
  },
  watch: {
    $route(to, from) {
      this.getArchiveRes()
    }
  },
  methods: {
    currentChange(val) {
      this.currentPage = val
      this.getArchiveRes()
    },
    async getArchiveRes() {
      const archiveRes = await getArchiveRes(this.$route, this.currentPage, this.limit)
      if (archiveRes.status === 200) {
        this.archives = archiveRes.data
        this.total = archiveRes.total
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.archives {
  &__year {
    padding: 12px;
    .year-text {
      font-size: 22px;
      padding: 16px 0 28px 0;
    }
  }
  &__content {
    display: flex;
    align-items: center;
    .content-left {
      width: 80px;
      height: 80px;
      overflow: hidden;
      a {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      img[src=''],
      img:not([src]) {
        opacity: 0;
      }
    }
    .content-right {
      margin-left: 24px;
      &__title,
      &__title a {
        transition: all 0.38s ease;
      }
      &__title {
        font-size: 16px;
        padding: 8px 0;
      }
      &__title:hover a,
      &__title:hover {
        @include themeify() {
          color: themed('color-ele-primary');
        }
        transform: translateX(12px);
      }
      &__date {
        @include themeify() {
          color: themed('color-home-article-detail');
        }
        padding: 8px 0;
      }
    }
  }
  &__page {
    padding: 16px;
    @include flex-box-center;
  }
}
</style>
