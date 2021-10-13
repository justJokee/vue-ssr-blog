<template>
  <div class="article-show">
    <div class="article-show-content">
      <div v-for="(item, index) in articles.only" class="article-body" :key="index">
        <h2 class="article-title">{{ item.title }}</h2>
        <div class="article-details">
          <div class="article-details-tag">
            <span class="icon-tag-stroke i-p"></span>
            <!-- <span class="each-tag" v-for="tag in item.tag">{{ tag | changeLife }}</span> -->
          </div>
          <div class="article-details-other">
            <div class="time">
              <span class="icon-clock i-p"></span>
              <span>{{ item.date | reviseTime }} 发表</span>
            </div>
            <div class="pv-c-l">
              <span class="icon-eye i-p"></span>
              <span>{{ item.pv }} 次阅读</span>
              <span class="icon-commenting-o i-p"></span>
              <span>{{ item.commentNum }} 条评论</span>
              <span class="icon-like i-p"></span>
              <span>{{ item.likeNum }} 个赞</span>
            </div>
          </div>
        </div>
        <hr />
        <div v-html="item.content" class="article-body">{{ item.content }}</div>
        <div
          class="article-like"
          :class="{ 'article-like-after': lovedArr.indexOf(item._id) !== -1 }"
          @click="love(item.articleId, item._id)"
        >
          <span class="love-text">{{ love_t }}</span>
        </div>
        <div class="article-warning" v-if="item.original">
          <h6>本文为作者原创文章，转载请注明出处：</h6>
          <i>
            <a href="javascript: void(0)">http://www.mapblog.cn{{ fullPath }}</a>
          </i>
        </div>
        <div class="article-line"></div>
        <h4>分享：</h4>
        <div class="share">
          <a
            href="javascript: void(0)"
            @click="share('QQ', 'http://connect.qq.com/widget/shareqq/index.html')"
            class="design-bg-qq"
          ></a>
          <a
            href="javascript: void(0)"
            @click="share('qzone', 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey')"
            class="design-bg-qzone"
          ></a>
          <a
            href="javascript: void(0)"
            @click="share('sina', 'http://v.t.sina.com.cn/share/share.php')"
            class="design-bg-sina"
          ></a>
          <a href="javascript: void(0)" @click="qrcode" class="design-bg-weixin"></a>
          <a
            href="javascript: void(0)"
            @click="share('douban', 'http://shuo.douban.com/!service/share')"
            class="design-bg-douban"
          ></a>
        </div>
        <div class="otherArticle"></div>
        <div class="qrcode-box" v-show="qrShow">
          <span>微信扫一扫分享到朋友圈</span>
          <span class="exit-qrcode" @click="exitQrcode">X</span>
          <div id="qrcode"></div>
        </div>
        <div class="pre-next">
          <div class="pre" v-if="articles.pre_next.pre.length">
            <h6>上一篇：</h6>
            <!-- <a href="javascript: void(0)" v-for="item in articles.pre_next.pre"> -->
            <span @click="jumpPn(item)">{{ item.title }}</span>
            <!-- </a> -->
          </div>
          <div class="next" v-if="articles.pre_next.next.length">
            <h6>下一篇：</h6>
            <!-- <a href="javascript: void(0)" v-for="item in articles.pre_next.next"> -->
            <span @click="jumpPn(item)">{{ item.title }}</span>
            <!-- </a> -->
          </div>
        </div>
      </div>
    </div>
    <comment></comment>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import comment from '@/components/comment/comment'
export default {
  components: {
    comment
  },
  data() {
    return {
      qrShow: false,
      loveText: '赞',
      lovedArr: [],
      fullPath: ''
    }
  },
  metaInfo() {
    const title = this.articles.only[0].title
    return {
      title: title + ' -mapblog小站',
      meta: [
        { vmid: 'description', name: 'description', content: title + ' -mapblog小站' },
        { vmid: 'keywords', name: 'keywords', content: title + ',一个关键词,两个关键词' }
      ]
    }
  },
  asyncData({ store, route }) {
    return store
      .dispatch('getArticle', {
        publish: 1,
        // tag: route.params.articleList,
        articleId: route.params.id,
        cache: true
      })
      .then(res => {
        store.commit('changeTitle', store.state.articles.only[0].title)
        return { fakeArticle: res }
      })
  },
  filters: {
    changeLife: function(value) {
      if (value == 'life') {
        return '生活'
      } else {
        return value
      }
    }
  },
  mounted() {
    if (localStorage.getItem('articleLoved')) {
      this.lovedArr = JSON.parse(localStorage.getItem('articleLoved'))
    }
    this.$nextTick(function() {
      Prism.highlightAll()
    })
    this.getOriginUrl()
  },
  computed: {
    ...mapState(['articles']),
    love_t: function() {
      if (this.lovedArr.indexOf(this.articles.only[0]._id) !== -1) {
        return '已赞'
      } else {
        return '赞'
      }
    },
    ifCatch: function() {
      return this.articles.only
    }
  },
  watch: {
    //推荐文章的引起路由变化重新进行抓取
    $route() {
      //二级评论进行锚点跳转
      let r = this.$route
      if (r.fullPath.indexOf('#anchor-comment') === -1) {
        this.getArticle({
          publish: true,
          tag: r.params.articleList,
          articleId: r.params.id
        }).then(() => {
          this.changeTitle(this.articles.only[0].title)
          this.$nextTick(function() {
            Prism.highlightAll()
          })
        })
      }
    },
    //抓取数据延时较高时，确保抓取到数据之后进行一次代码样式的渲染
    ifCatch() {
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  },
  methods: {
    ...mapActions(['getArticle', 'loveArticle']),
    ...mapMutations(['changeTitle']),
    // 点击回复按钮会在地址栏加上锚点，故刷新时去除，第三方分享链接亦如此
    getOriginUrl: function() {
      if (this.$route.fullPath.indexOf('#anchor-comment') > -1) {
        this.fullPath = this.$route.fullPath.substring(0, this.$route.fullPath.indexOf('#'))
      } else {
        this.fullPath = this.$route.fullPath
      }
    },
    love: function(aid, _id) {
      if (this.lovedArr.indexOf(_id) === -1) {
        this.loveArticle({
          articleId: aid,
          num: 1,
          title: document.title
        }).then(data => {
          if (data.code === 200) {
            this.lovedArr.push(_id)
            localStorage.setItem('articleLoved', JSON.stringify(this.lovedArr))
          }
        })
      } else {
        this.loveArticle({
          articleId: aid,
          num: -1,
          title: document.title
        }).then(data => {
          if (data.code === 200) {
            this.lovedArr.splice(this.lovedArr.indexOf(_id), 1)
            localStorage.setItem('articleLoved', JSON.stringify(this.lovedArr))
          }
        })
      }
    },
    jumpPn: function(item) {
      if (item.tag[0] === 'life') {
        this.$router.push({ name: 'lifeShow', params: { id: item.articleId } })
      } else {
        this.$router.push({ name: 'articleShow', params: { articleList: item.tag[0], id: item.articleId } })
      }
    },
    share: function(type, url) {
      let title = document.title + ' 这是一个积累web知识的个人博客'
      let el = document.createElement('a')
      let _href
      let _url
      if (window.location.href.indexOf('#anchor-comment') > -1) {
        _url = window.location.href.substring(0, window.location.href.indexOf('#'))
      } else {
        _url = window.location.href
      }
      el.target = '_blank'
      switch (type) {
        case 'QQ':
          _href = url + '?title=' + title + '&url=' + _url + '&desc=我分享了一篇文章，快来看看哦~' + '&site=mapblog小站'
          break
        case 'qzone':
          _href =
            url +
            '?title=' +
            title +
            '&url=' +
            _url +
            '&desc=我分享了一篇文章，快来看看哦~' +
            '&site=mapblog小站' +
            'summary='
          break
        case 'sina':
          _href = url + '?title=' + title + '&url=' + _url
          break
        case 'weixin':
          _href = url + '&url=' + _url
          break
        case 'douban':
          _href = url + '?name=' + title + '&href=' + _url
      }
      el.href = _href
      el.click()
    },
    //微信二维码生成器
    qrcode: function() {
      if (this.qrShow === false) {
        this.qrShow = true
        let _url = window.location.href
        new QRCode(document.getElementById('qrcode'), {
          text: _url,
          width: 160,
          height: 160,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      }
    },
    //关闭微信二维码
    exitQrcode: function() {
      this.qrShow = false
      document.getElementById('qrcode').innerHTML = ''
    }
  }
}
</script>
<style lang="less">
.article-show-content {
  margin-top: 10px;
  /*background: #F7EDED;*/
  background: #faf7f7;
  color: #404040;
  font-size: 14px;
  line-height: 1.8;
  padding: 15px;
  border: 5px 5px 0 0;
  border-radius: 3px;
  hr {
    margin: 15px 0;
    height: 0;
    border: 0;
    border-top: 1px solid #ccc;
  }
  img {
    max-width: 100%;
  }
}
.article-title {
  padding: 5px 0;
  color: #16a085;
}
.article-body li {
  margin-left: 15px;
}
.article-details {
  font-size: 12px;
  line-height: 24px;
  color: #404040;
}
.article-details-tag {
  display: flex;
  align-items: center;
}
.each-tag {
  margin-right: 8px;
}
.icon-tag-stroke,
.icon-eye,
.icon-clock {
  margin-top: 2px;
}
.article-details-other {
  display: flex;
  /*align-items: center;*/
  justify-content: space-between;
  flex-wrap: wrap;
}
.i-p {
  margin: 0 5px;
}
.article-like {
  background: url('/img/love-before.png') no-repeat;
  width: 50px;
  height: 50px;
  margin: 15px auto;
  cursor: pointer;
  text-align: center;
  transition: all ease 0.5s;
}
.love-text {
  display: inline-block;
  user-select: none;
  color: #f7eded;
  margin-top: 7px;
}
.article-like-after {
  transform: rotateY(360deg);
  background: url('/img/love-after.png') no-repeat;
}
.article-like-after:hover,
.article-like:hover {
  animation: move 1.5s;
}
@keyframes move {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.article-line {
  height: 2px;
  margin-top: 10px;
  background: #ccc;
}
.share a {
  display: inline-block;
  width: 32px;
  height: 32px;
  padding: 1px;
  margin: 0 5px;
  transition: all ease 0.5s;
}
.share a:hover {
  opacity: 0.8;
  transform: rotate(360deg);
}
.share .design-bg-qq {
  margin: 0 5px 0 0;
  background: url('/img/share.png') 0 0 no-repeat !important;
}
.design-bg-qzone {
  background: url('/img/share.png') -57px 0 no-repeat !important;
}
.design-bg-sina {
  background: url('/img/share.png') -118px -71px no-repeat !important;
}
.design-bg-douban {
  background: url('/img/share.png') -118px -138px no-repeat !important;
}
.design-bg-weixin {
  background: url('/img/share.png') 0 -71px no-repeat !important;
}
.qrcode-box {
  position: fixed;
  z-index: 2000;
  padding: 0 15px 15px 15px;
  border-radius: 15px;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  background: #ccc;
}
.qrcode-box span:nth-child(1) {
  font-size: 12px;
}
#qrcode img {
  margin: 0 auto;
}
.exit-qrcode {
  float: right;
  margin-right: 2px;
  cursor: pointer;
}
.article-warning {
  h6 {
    line-height: 1.2;
    padding: 1px 0 0 5px;
    display: inline-block;
    border-left: 5px solid orange;
  }
  a {
    display: inline-block;
    color: #404040;
  }
  a:hover {
    text-decoration: underline;
    color: #16a085;
  }
}
.pre-next {
  margin-top: 10px;
  h6 {
    display: inline-block;
  }
  a {
    color: #404040;
  }
  a:hover {
    color: #16a085;
    text-decoration: underline;
  }
}
</style>
