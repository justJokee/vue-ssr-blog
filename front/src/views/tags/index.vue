<doc>
  @desc:   标签
  @author: justJokee 
</doc>
<template>
  <div class="tags">
    <layout _title="标签">
      <tags-iterator :tags="tags"></tags-iterator>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import tagsIterator from '@/views/components/tags-iterator'
export default {
  name: 'tags',
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
