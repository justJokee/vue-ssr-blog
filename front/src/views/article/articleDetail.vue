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
            发表时间 {{ article.date | formatDate }}
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
      <a href="#2.2">点击跳转</a>
      <note>
        <p>{{ article.abstract }}</p>
      </note>
      <div v-html="article.content" class="article-detail__body"></div>
      <div :style="{ height: height + 'px' }"></div>
      <button @click="height = 400">666</button>
      <div class="article-detail__comment">
        <div class="comment__title"></div>
        <div class="comment__list">
          <comments :messages="messages" @submitReply="submitReply" @addLike="addLike"></comments>
        </div>
        <div class="comment__page">
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
import { mapMutations } from 'vuex'
import api from '@/api/'
import note from '@/components/note/'
import { generateTree } from '@/utils/generateTree'
import { getRandomCharacter } from '@/utils/getRandomCharacter'
import comments from '@/views/components/comments'

export default {
  name: 'articleDetail',
  components: { note, comments },
  props: {},
  // 动态属性
  data() {
    return {
      height: 0,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      article: {},
      messages: [],
      flatTree: null
    }
  },
  computed: {
    tags() {
      if (this.article.tag) return this.article.tag.join('&nbsp;&nbsp;')
    }
  },
  watch: {},
  filters: {},
  mounted() {
    this.$nextTick(function() {
      Prism.highlightAll()
    })
    this.collectTitles()
    window.addEventListener('scroll', this.handleScroll, false)
  },
  updated() {},
  async asyncData({ route }) {
    const articleRes = await api.getArticle({
      publish: 1,
      articleId: route.params.id
    })
    const commentRes = await api.getArticleComments({
      page: 1,
      limit: 10,
      articleId: route.params.id
    })
    if (articleRes.status === 200)
    { return { article: articleRes.data, messages: commentRes.data, total: commentRes.total } }
  },
  methods: {
    ...mapMutations(['setCatalogs', 'setActiveCatalog']),
    async submitReply(content, currentReplyMessage, cb) {},
    async addLike(message) {
      const inc = message.liked ? -1 : 1
      const likeRes = await api.likeArticleComment({
        _id: message._id,
        inc
      })
      if (likeRes.status === 200) {
        let finder
        this.messages.some(msg => {
          if (msg._id === likeRes.data._id) {
            finder = msg
            return true
          }
          if (msg.reply && msg.reply.length) {
            let done = false
            msg.reply.some(er => {
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
    async currentChange(val) {
      this.currentPage = val
      const commentRes = await api.getArticleComments({
        page: val,
        limit: this.limit,
        articleId: this.$route.params.id
      })
      if (commentRes.status === 200) {
        this.total = commentRes.total
        this.messages = commentRes.data
      }
    },
    collectTitles() {
      const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(et => '.article-detail__body ' + et).join(',')
      const nodeList = document.querySelectorAll(selectors)
      if (!nodeList) return
      console.log(nodeList)

      const flatTree = Array.from(nodeList).map(node => {
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
          this.addTreeLevel(catalog.children, level + 1, index + 1)
        }
      })
    },

    handleScroll(e) {
      this.flatTree.some(item => {
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
}
</style>
