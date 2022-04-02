<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  components: {},
  data() {
    return {
      location: [],
      timer: '',
      showBackTop: true
    }
  },
  watch: {},
  mounted() {
    this.initPannel()
  },
  computed: {},
  methods: {
    ...mapMutations(['setArchives', 'setCategory', 'setTags', 'setNewComments', 'setNewArticles', 'setTotals']),
    initPannel() {
      this.$api.getArchives({ countType: 'month', page: 1, limit: 1000 }).then((res) => {
        if (res.status === 200) this.setArchives(res.data)
      })
      this.$api.getCategory().then((res) => {
        if (res.status === 200) {
          this.setTotals({ key: 'category', value: res.total })
          this.setCategory(res.data)
        }
      })
      this.$api.getTags().then((res) => {
        if (res.status === 200) {
          this.setTotals({ key: 'tag', value: res.total })
          this.setTags(res.data)
        }
      })
      this.$api
        .getArticleComments({
          page: 1,
          limit: 5
        })
        .then((res) => {
          if (res.status === 200) this.setNewComments(res.data)
        })
      this.$api
        .getArticles({
          publish: 1,
          page: 1,
          limit: 5,
          content: 0
        })
        .then((res) => {
          if (res.status === 200) {
            this.setTotals({ key: 'article', value: res.total })
            this.setNewArticles(res.data)
          }
        })
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/reset.scss';
@import './assets/css/prism.css';
@import './assets/css/emoji-sprite.css';
</style>
