<doc>
  @desc:   归档
  @author: justJokee 
</doc>
<template>
  <div class="archives">
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in archives"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>
<script>
import api from '@/api/'
export default {
  name: 'archives',
  data() {
    return {
      archives: []
    }
  },
  async asyncData() {
    const archiveRes = await api.getCategory({})
    if (archiveRes.status === 200) return { archives: archiveRes.data }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.archives {
}
</style>
