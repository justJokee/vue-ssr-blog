<doc>
  @desc:   看板
  @author: justJokee 
</doc>
<template>
  <div class="pannel">
    <pannel-introduction :style="{ width: stickyOffsetWidth }"></pannel-introduction>
    <div
      class="pannel__sticky"
      :class="{
        'pannel--sticky-top': sticky,
        'pannel--sticky-rollback': rollBack && !stickyBottom,
        'pannel--sticky-bottom': stickyBottom
      }"
      :style="{ width: stickyOffsetWidth }"
    >
      <component v-for="(pannel, index) in enums" class="pannel__item" :is="pannel" :key="index"></component>
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
      stickyOffsetHeight: 0,
      observer: null
    }
  },
  mounted() {
    this.initStickybehavior()
  },
  watch: {
    $route(to, from) {
      //  锚点跳转防止routeUpdate
      if (JSON.stringify(to.params) !== JSON.stringify(from.params)) {
        this.removeEffect()
        this.initStickybehavior()
      }
    }
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
          this.pannels.excludes.forEach((item) => {
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
      this.observer = new ResizeObserver(() => {
        this.pannelOffsetHeight = pannelNode.offsetHeight
        this.stickyOffsetHeight = stickNode.offsetHeight
      })
      this.observer.observe(pannelNode, { attributes: true, childList: false, subtree: false })
      this.observer.observe(stickNode, { attributes: true, childList: false, subtree: false })
      this.$nextTick(() => {
        this.stickyOffsetTop = getElementTop(stickNode)
        this.pannelOffsetTop = getElementTop(pannelNode)
        this.stickyOffsetHeight = stickNode.offsetHeight
        this.stickyOffsetWidth = stickNode.offsetWidth + 'px'
        this.pannelOffsetHeight = pannelNode.offsetHeight
      })
    },
    stickyHandler() {
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
    resizeHandler: debounce(function () {
      console.log('resize触发====》》》》》')
      const pannelNode = document.querySelector('.pannel')
      const layoutBody = document.querySelector('.layout__body-content')
      this.stickyOffsetWidth = pannelNode.offsetWidth + 'px'
      const maxWidth = window.getComputedStyle(layoutBody)['max-width']
      // 切换至手机尺寸后，将sticky相关状态全部置空
      if (maxWidth === '768px') {
        this.sticky = false
        this.stickyBottom = false
      }
    }, 200),
    removeEffect() {
      this.sticky = false
      this.stickyBottom = false
      this.observer.disconnect()
      window.removeEventListener('scroll', this.stickyHandler, false)
      window.removeEventListener('resize', this.resizeHandler, false)
    }
  },

  destroyed() {
    this.removeEffect()
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.pannel {
  position: relative;
  height: 100%;
  &__sticky {
    transition: all ease 0.38s;
  }
  &__item:not(:first-child) {
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
@include respond-to(xs) {
  .pannel {
    margin-top: 16px;
  }
  .pannel__sticky {
    position: relative !important;
    top: 0 !important;
  }
}
</style>
