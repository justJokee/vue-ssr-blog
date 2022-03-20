<doc>
  @desc:   文章详情
  @author: justJokee
</doc>
<template>
  <div class="article-detail">
    <layout :headerBg="article.headerPic">
      <div class="article-detail__header" slot="custom-header">
        <h1 class="article-detail__title">{{ article.title }}</h1>
        <div class="article-detail__info info-1">
          <span>
            <i class="el-icon-date"></i>
            发表时间 {{ article.createTime | formatDate }}
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span>
            <i class="el-icon-price-tag"></i>
            标签 {{ tags }}
          </span>
        </div>
        <div class="article-detail__info info-2">
          <span>
            <i class="el-icon-chat-dot-round"></i>
            阅读量 {{ article.pv }}
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
      </div>
      <note>
        <p>{{ article.abstract }}</p>
      </note>
      <div v-html="article.content" class="article-detail__body"></div>
      <div class="article-detail__copyright">
        <copyright :url="url"></copyright>
      </div>
      <div class="article-detail__share">
        <share :tags="article.tag" :abstract="article.abstract" :title="article.title"></share>
      </div>
      <div class="article-detail__prevnext">
        <prevnext :article="article"></prevnext>
      </div>
      <div class="article-detail__comment">
        <a id="a_cm"></a>
        <div class="comment__title">
          <i class="el-icon-chat-dot-round"></i>
          <span>文章评论</span>
        </div>
        <div class="comment__submit">
          <submit @submitContent="submitContent"></submit>
        </div>
        <div class="comment__total">
          <span>{{ total }}条评论</span>
        </div>
        <div class="comment__list">
          <comments :messages="messages" @submitReply="submitReply" @addLike="addLike"></comments>
        </div>
        <div class="comment__page" v-if="total">
          <el-pagination
            :current-page.sync="currentPage"
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
import { mapState, mapMutations } from 'vuex'
import api from '@/api/'
import note from '@/components/note/'
import { generateTree } from '@/utils/generateTree'
import { getRandomCharacter } from '@/utils/getRandomCharacter'
import comments from '@/views/components/comments'
import submit from '@/views/components/submit'
import copyright from './components/copyright'
import share from './components/share'
import prevnext from './components/prevnext'

function jumpAnchor(route) {
  if (route.query.anchor === 'a_cm') {
    const el = document.querySelector('#a_cm')
    el.scrollIntoView()
  }
}

export default {
  name: 'articleDetail',
  components: { note, comments, submit, copyright, share, prevnext },
  props: {},
  // 动态属性
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      article: {},
      messages: [],
      flatTree: null
    }
  },
  computed: {
    ...mapState(['visitorInfo']),
    tags() {
      if (this.article.tag) return this.article.tag.join(' ')
      return ''
    },
    url() {
      return `${process.env.BASE_URL}/app/article/${this.article.articleId}`
    }
  },
  watch: {
    $route(to, from) {
      if (to.params.id !== from.params.id) {
        this.$nextTick(() => {
          this.collectTitles()
        })
      }
    }
  },
  filters: {},
  mounted() {
    this.$nextTick(function () {
      Prism.highlightAll()
    })
    this.collectTitles()
    window.addEventListener('scroll', this.handleScroll, false)
  },
  updated() {},
  async asyncData({ route, isServer }) {
    const articleRes = await api.getArticle({
      publish: 1,
      articleId: route.params.id
    })
    const commentRes = await api.getArticleComments({
      page: 1,
      limit: 10,
      articleId: route.params.id
    })
    if (articleRes.status === 200) {
      if (!isServer) setTimeout(() => jumpAnchor(route), 0)
      return { article: articleRes.data, messages: commentRes.data, total: commentRes.total }
    }
  },
  methods: {
    ...mapMutations(['setCatalogs', 'setActiveCatalog']),
    async addLike(message) {
      const inc = message.liked ? -1 : 1
      const likeRes = await api.likeArticleComment({
        _id: message._id,
        inc
      })
      if (likeRes.status === 200) {
        let finder
        this.messages.some((msg) => {
          if (msg._id === likeRes.data._id) {
            finder = msg
            return true
          }
          if (msg.reply && msg.reply.length) {
            let done = false
            msg.reply.some((er) => {
              if (er._id === likeRes.data._id) {
                finder = er
                done = true
              }
            })
            return done
          }
        })
        if (finder) {
          finder.like = likeRes.data.like
          finder.liked = likeRes.data.liked
        }
        this.$message({
          type: 'success',
          message: likeRes.info
        })
      }
    },
    submitContent(content, cb) {
      this.submit(content, null, cb)
    },
    submitReply(content, currentReplyComment, cb) {
      this.submit(content, currentReplyComment, cb)
    },
    async submit(content, currentReplyComment, cb) {
      let parentId
      let aite
      if (currentReplyComment) {
        if (currentReplyComment.parentId) parentId = currentReplyComment.parentId
        else parentId = currentReplyComment._id
        aite = currentReplyComment.name
      }
      const res = await api.saveArticleComment({
        articleId: this.$route.params.id,
        name: this.visitorInfo.name,
        imgUrl: this.visitorInfo.imgUrl,
        email: this.visitorInfo.email,
        link: this.visitorInfo.link,
        content: content,
        parentId,
        aite
      })
      if (res.status === 200) {
        if (cb) cb()
        this.$message({
          type: 'success',
          message: '评论成功'
        })
        this.getArticleComments()
      }
    },
    async currentChange(val) {
      this.currentPage = val
      this.getArticleComments()
    },
    async getArticleComments() {
      const commentRes = await api.getArticleComments({
        page: this.currentPage,
        limit: this.limit,
        articleId: this.$route.params.id
      })
      if (commentRes.status === 200) {
        this.total = commentRes.total
        this.messages = commentRes.data
      }
    },
    collectTitles() {
      const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((et) => '.article-detail__body ' + et).join(',')
      const nodeList = document.querySelectorAll(selectors)
      if (!nodeList) return
      console.log(nodeList)

      const flatTree = Array.from(nodeList).map((node) => {
        const a = document.createElement('a')
        const tempId = getRandomCharacter(4)
        const firstChild = node.firstChild
        a.setAttribute('name', node.innerText)
        a.setAttribute('id', tempId)
        // node.appendChild(a)
        node.insertBefore(a, firstChild)
        return {
          level: parseInt(node.nodeName.substr(1)),
          name: node.innerText,
          tempId
        }
      })
      this.flatTree = [...flatTree]
      this.flatTree.reverse()
      const catalogs = generateTree(flatTree)
      this.addTreeLevel(catalogs)
      this.setCatalogs(catalogs)
      console.log(catalogs)
    },
    addTreeLevel(catalogs, level, order) {
      catalogs.forEach((catalog, index) => {
        if (!level) level = 0
        catalog.level_tree = level
        catalog.order = order ? order + '.' + (index + 1) : index + 1
        const dom = document.getElementById(catalog.tempId)
        dom.removeAttribute('name')
        dom.setAttribute('name', catalog.order)
        if (catalog.children && catalog.children.length) {
          this.addTreeLevel(catalog.children, level + 1, catalog.order)
        }
      })
    },

    handleScroll() {
      if (!this.flatTree) return
      this.flatTree.some((item) => {
        const node = document.getElementById(item.tempId)
        if (node.getBoundingClientRect().y < 5) {
          this.setActiveCatalog(item.tempId)
          return true
        }
      })
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, false)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/index.scss';
.article-detail {
  &__header {
    width: 100%;
    height: 100%;
    @include flex-box-center;
    flex-direction: column;
  }
  &__body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Lato, Roboto, 'PingFang SC',
      'Microsoft JhengHei', 'Microsoft YaHei', sans-serif;
    line-height: 2;
    color: #4c4948;
  }
  &__title {
    @include themeify() {
      color: themed('color-title');
    }
  }

  &__info {
    @include themeify() {
      color: themed('color-navbar');
    }
  }
  .info-2 {
    margin-top: 8px;
  }
  &__copyright {
    margin-top: 28px;
  }
  &__share {
    margin-top: 12px;
  }
  &__prevnext {
    margin-top: 28px;
  }
  &__comment {
    margin-top: 32px;
    .comment__title {
      padding: 16px 0;
      font-size: 20px;
      font-weight: 700;
      > [class^='el-icon-'] {
        font-weight: 700;
      }
      span {
        margin-left: 12px;
      }
    }
    .comment__total {
      color: #4c4948;
      font-size: 25px;
      font-weight: bold;
      margin-top: 28px;
    }
    .comment__list {
      margin-top: 28px;
    }
    .comment__page {
      @include flex-box-center;
      padding: 16px 0;
    }
  }
}
</style>
