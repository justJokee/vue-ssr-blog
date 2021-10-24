<doc>
  @desc: 首页
  @author: justJokee
</doc>
<template>
  <div class="home">
    <layout>
      <div class="home-header" slot="header">
        <div class="home-header-dictum">
          <div class="site-name">Marco's Blog</div>
          <div class="dictum-info">
            <span>{{ dictumInfo }}</span>
            <span class="typed-cursor" :class="{ 'typed-cursor-anmation': watingTyped }">|</span>
          </div>
        </div>
        <div class="home-header-go" @click="go">
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="article">
        <el-card>一堆文章</el-card>
      </div>
    </layout>
  </div>
</template>

<script>
// 导入工具/组件
import scrollTo from '@/utils/scrollTo'
export default {
  // 组件名称
  name: 'home',
  // 子组件
  components: {},
  props: {},
  data() {
    return {
      dictumInfo: '',
      timer: null,
      backTimer: null,
      watingTyped: false,
      dictums: [
        ['你瞧这些白云聚了又散，散了又聚，人生离合，亦复如斯', '出自：金庸'],
        ['人在江湖，身不由己', '出自：古龙'],
        ['倘若我问心有愧呢', '出自：《倚天屠龙记》']
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.startPlay()
  },

  methods: {
    go() {
      const height = document.querySelector('.home-header').clientHeight
      scrollTo(height)
    },
    async startPlay() {
      const dictums = this.dictums.flat()
      const tasks = dictums.map((dictum, index) => {
        return this.createTask(async resolve => {
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
      await tasks.reduce((pre, next, index, arr) => pre.then(ret => next(ret)), Promise.resolve())
      this.startPlay()
    },
    createTask(cb) {
      return () =>
        new Promise(resolve => {
          cb(resolve)
        })
    },
    sleep(delay = 500) {
      return new Promise(resolve => {
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
.home {
  .home-header {
    height: 100vh;
    background-image: url(https://cdn.jsdelivr.net/gh/jerryc127/butterfly_cdn@2.1.0/top_img/index.jpg);
    background-position: center;
    background-size: cover;
    position: relative;
    @include flex-box-center;
    .home-header-dictum {
      display: flex;
      flex-direction: column;
      align-items: center;
      @include themeify() {
        color: themed('color-navbar');
      }
      .dictum-info {
        font-size: 24px;
        margin-top: 24px;
        .typed-cursor {
          display: inline-block;
          margin-left: 4px;
          font-size: 28px;
        }
        .typed-cursor-anmation {
          animation: typed 0.5s ease infinite alternate;
        }
      }
      .site-name {
        font-size: 38px;
      }
    }
    .home-header-go {
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
  }
  .article {
    height: 2500px;
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
