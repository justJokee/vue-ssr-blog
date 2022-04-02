<doc>
  @desc: 首页
  @author: justJokee
</doc>
<template>
  <div class="home-article">
    <layout>
      <div id="home-article-header" class="home-article__header" slot="header">
        <div class="home-article__dictum">
          <div class="home-article__site-name">Marco's Blog</div>
          <div class="home-article__dictum-info">
            <span>{{ dictumInfo }}</span>
            <span class="home-article__typed-cursor" :class="{ 'is-typed-cursor-anmation': watingTyped }">|</span>
          </div>
        </div>
        <div class="home-article__go" @click="go">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="home-article__body" slot="custom-body">
        <article-iterator :articles="articles"></article-iterator>

        <div class="home-article__page">
          <el-pagination
            v-if="articles.length"
            :total="total"
            layout="prev, pager, next"
            :page-size="pageSize"
            @current-change="currentChange"
          ></el-pagination>
        </div>
      </div>
    </layout>
  </div>
</template>

<script>
// 导入工具/组件
import scrollTo from '@/utils/scrollTo'
import api from '@/api/'
import articleIterator from '@/views/components/article-iterator'
export default {
  // 组件名称
  name: 'home',
  // 子组件
  components: {
    articleIterator
  },
  props: {},
  data() {
    return {
      total: 0, //
      pageSize: 8,
      dictumInfo: '',
      timer: null,
      backTimer: null,
      watingTyped: false,
      hidePage: false,
      articles: [],
      dictums: [
        ['你瞧这些白云聚了又散，散了又聚，人生离合，亦复如斯。', '出自：金庸'],
        ['人在江湖，身不由己。', '出自：古龙'],
        ['天涯思君不可忘。', '出自：《倚天屠龙记》']
      ]
    }
  },
  computed: {},
  watch: {},
  async mounted() {
    this.startPlay()
  },
  async asyncData() {
    const articleRes = await api.getArticles({
      publish: 1,
      page: 1,
      content: 0
    })
    if (articleRes.status === 200) return { articles: articleRes.data, total: articleRes.total }
  },
  methods: {
    async currentChange(val) {
      const articleRes = await api.getArticles({
        publish: 1,
        limit: 1,
        page: val,
        content: 0
      })
      if (articleRes.status === 200) {
        this.total = articleRes.total
        this.articles = articleRes.data
      }
    },

    go() {
      const height = document.querySelector('#home-article-header').clientHeight
      scrollTo(height)
    },
    async startPlay() {
      const dictums = this.dictums.flat()
      const tasks = dictums.map((dictum) => {
        return this.createTask(async (resolve) => {
          let i = 0
          this.timer = setInterval(async () => {
            this.dictumInfo = dictum.substring(0, i + 1)
            i++
            if (i >= dictum.length) {
              if (this.timer) {
                clearInterval(this.timer)
                this.watingTyped = true
                await this.sleep(800)
                this.watingTyped = false
                this.backTimer = setInterval(async () => {
                  this.dictumInfo = dictum.substring(0, i)
                  i--
                  if (i < 0) {
                    this.watingTyped = true
                    await this.sleep(200)
                    this.watingTyped = false
                    resolve()
                    if (this.backTimer) clearInterval(this.backTimer)
                  }
                }, 100)
              }
            }
          }, 250)
        })
      })
      await tasks.reduce((pre, next) => pre.then((ret) => next(ret)), Promise.resolve())
      this.startPlay()
    },
    createTask(cb) {
      return () =>
        new Promise((resolve) => {
          cb(resolve)
        })
    },
    sleep(delay = 500) {
      return new Promise((resolve) => {
        setTimeout(resolve, delay)
      })
    }
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer)
    if (this.backTimer) clearInterval(this.backTimer)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/index.scss';
.home-article {
  &__header {
    height: 100vh;
    background-image: url(https://cdn.jsdelivr.net/gh/jerryc127/butterfly_cdn@2.1.0/top_img/index.jpg);
    background-position: center;
    background-size: cover;
    position: relative;
    @include flex-box-center;
  }
  &__dictum {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include themeify() {
      color: themed('color-navbar');
    }
  }
  &__dictum-info {
    text-align: center;
    font-size: 24px;
    margin-top: 24px;
    padding: 0 16px;
    line-height: 1.5;
  }
  &__typed-cursor {
    display: inline-block;
    margin-left: 4px;
    font-size: 28px;
  }
  .is-typed-cursor-anmation {
    animation: typed 0.5s ease infinite alternate;
  }
  &__site-name {
    font-size: 38px;
  }
  &__go {
    position: absolute;
    bottom: 0;
    padding: 8px 0;
    text-align: center;
    width: 100%;
    cursor: pointer;
    .el-icon-arrow-down {
      animation: dance 1.5s ease-in infinite alternate;
      font-weight: 900;
      font-size: 24px;
      @include themeify() {
        color: themed('color-navbar');
      }
    }
  }
  &__body {
    // padding: 40px 0px;
  }

  &__page {
    padding: 16px 0;
    @include flex-box-center;
  }
}
@keyframes dance {
  from {
    opacity: 0.6;
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}
@keyframes typed {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
