<doc>
  @desc:   标签
  @author: justJokee 
</doc>
<template>
  <div class="tags">
    <layout _title="标签" cover="/img/cover/tags.jpg">
      <tags-iterator :tags="tags"></tags-iterator>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import tagsIterator from '@/views/components/tags-iterator'
export default {
  name: 'tags',
  metaInfo() {
    return {
      title: `标签  - Marco's Blog`,
      meta: [
        {
          name: 'description',
          content: '用nodejs开发的豆瓣爬虫 douban-spider-v，同步我的观影记录'
        },
        {
          name: 'keywords',
          content: '豆瓣电影,豆瓣爬虫,豆瓣爬虫,douban spider'
        }
      ]
    }
  },
  components: { tagsIterator },
  data() {
    return {
      tags: []
    }
  },
  async asyncData() {
    const tagRes = await api.getTags({})
    if (tagRes.status === 200) return { tags: tagRes.data, total: tagRes.total }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
</style>
