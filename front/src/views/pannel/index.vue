<doc>
  @desc:   看板
  @author: justJokee 
</doc>
<template>
  <div class="pannel">
    <pannel-introduction></pannel-introduction>
    <div
      class="pannel__sticky"
      :class="{
        'pannel--sticky-top': sticky,
        'pannel--sticky-rollback': rollBack && !stickyBottom,
        'pannel--sticky-bottom': stickyBottom
      }"
      :style="{ width: stickyOffsetWidth }"
    >
      <template v-for="(pannel, index) in enums">
        <component class="pannel__item" :is="pannel" :key="index"></component>
      </template>
      <!-- <pannel-catalog class="pannel__item"></pannel-catalog>
      <pannel-articles class="pannel__item"></pannel-articles>
      <pannel-comments class="pannel__item"></pannel-comments>
      <pannel-tags class="pannel__item"></pannel-tags>
      <pannel-category class="pannel__item"></pannel-category>
      <pannel-archives class="pannel__item"></pannel-archives> -->
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import pannelIntroduction from './components/pannel-introduction'
import pannelCatalog from './components/pannel-catalog'
import pannelArticles from './components/pannel-articles'
import pannelComments from './components/pannel-comments'
import pannelCategory from './components/pannel-category'
import PannelTags from './components/pannel-tags.vue'
import pannelArchives from './components/pannel-archives'
import { getScrollTop } from '@/utils/getScrollTop'
import { getElementTop } from '@/utils/getElementTop'
import debounce from 'lodash/debounce'
export default {
  name: 'pannel',
  components: {
    pannelIntroduction,
    pannelCatalog,
    pannelArticles,
    pannelComments,
    pannelCategory,
    PannelTags,
    pannelArchives
  },
  inject: {
    pannels: {
      from: 'pannels',
      default: () => ({})
    }
  },
  props: {},
  data() {
    return {
      sticky: false,
      stickyBottom: false,
      pannelOffsetTop: 0,
      stickyOffsetTop: 0,
      pannelOffsetHeight: 0,
      stickyOffsetWidth: 'auto',
      stickyOffsetHeight: 0
    }
  },
  mounted() {
    console.log(this.$router)
    this.initStickybehavior()
    // TODO: RESIZE事件更新stickyOffsetWidth
  },
  computed: {
    ...mapState(['rollBack']),
    enums() {
      // 路由进行自定义看板、顺序
      const def = [
        'pannel-catalog',
        'pannel-articles',
        'pannel-comments',
        'pannel-tags',
        'pannel-category',
        'pannel-archives'
      ]
      if (this.pannels) {
        if (this.pannels.includes && Array.isArray(this.pannels.includes)) return this.pannels.includes
        if (this.pannels.excludes) {
          this.pannels.excludes.forEach(item => {
            if (def.includes(item)) {
              const index = def.indexOf(item)
              if (index !== -1) def.splice(index, 1)
            }
          })
        }
      }
      if (this.$router.currentRoute.name !== 'articleDetail') {
        const index = def.indexOf('pannel-catalog')
        if (index !== -1) def.splice(index, 1)
      }
      return def
    }
  },
  methods: {
    initStickybehavior() {
      window.addEventListener('scroll', this.stickyHandler, false)
      window.addEventListener('resize', this.resizeHandler, false)
      const pannelNode = document.querySelector('.pannel')
      const stickNode = document.querySelector('.pannel__sticky')
      const observer = new ResizeObserver((mu, ob) => {
        console.log('dom观测触发===>>>>>>')
        this.pannelOffsetHeight = pannelNode.offsetHeight
        this.stickyOffsetHeight = stickNode.offsetHeight
      })
      observer.observe(pannelNode, { attributes: true, childList: false, subtree: false })
      this.$nextTick(() => {
        this.stickyOffsetTop = getElementTop(stickNode)
        this.pannelOffsetTop = getElementTop(pannelNode)
        this.stickyOffsetHeight = stickNode.offsetHeight
        this.stickyOffsetWidth = stickNode.offsetWidth + 'px'
        this.pannelOffsetHeight = pannelNode.offsetHeight
      })
    },
    stickyHandler(e) {
      if (this.stickyOffsetTop + this.stickyOffsetHeight >= this.pannelOffsetTop + this.pannelOffsetHeight) return
      const scrollTop = getScrollTop()
      const distance = this.rollBack ? 70 : 20
      if (this.stickyOffsetTop - scrollTop <= distance) {
        this.sticky = true
        this.stickyBottom = false
        // 当页面回滚，sticky容器将固定与top：70px位置，正常向下滚动，位于top：20px位置
        // 避免像素跳转，产生闪烁问题
        const threshold = this.rollBack ? 70 : 20

        if (this.pannelOffsetHeight + this.pannelOffsetTop - scrollTop - threshold <= this.stickyOffsetHeight) {
          this.sticky = false
          this.stickyBottom = true
        }
      } else {
        this.sticky = false
      }
    },
    resizeHandler: debounce(e => {
      const stickNode = document.querySelector('.pannel__sticky')
      this.stickyOffsetWidth = stickNode.offsetWidth + 'px'
    }, 200)
  }
}
</script>
<style lang="scss">
.pannel {
  position: relative;
  height: 100%;
  &__sticky {
    transition: all ease 0.38s;
  }
  &__item {
    margin-top: 16px;
  }
}
.pannel--sticky-top {
  position: fixed;
  top: 20px;
}
.pannel--sticky-bottom {
  position: absolute;
  bottom: 0;
}
.pannel--sticky-rollback {
  top: 70px;
}
</style>
