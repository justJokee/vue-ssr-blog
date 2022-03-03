<doc>
  @desc:   标签
  @author: justJokee 
</doc>
<template>
  <div class="tags">
    <layout _title="标签">
      <div class="tags__content">
        <span
          class="tags__item"
          v-for="(tag, index) in tags"
          :key="index"
          :style="{ color: color(), fontSize: fontSize() }"
          @click="filterArticles(tag.tag)"
        >
          {{ tag.tag }}
        </span>
      </div>
    </layout>
  </div>
</template>
<script>
import api from '@/api/'
import { getRandomColor } from '@/utils/getRandomColor'
export default {
  name: 'tags',
  data() {
    return {
      tags: []
    }
  },
  async asyncData() {
    const tagRes = await api.getTags({})
    if (tagRes.status === 200) return { tags: tagRes.data, total: tagRes.total }
  },
  methods: {
    filterArticles(tag) {
      this.$router.push({
        name: 'articleFilter',
        params: {
          type: 'tag',
          param: tag
        }
      })
    },
    color() {
      return getRandomColor()
    },
    fontSize() {
      const sizes = [26, 24, 22, 20, 18, 16, 14]
      const index = (parseFloat(Math.random().toFixed(2)) * 100) % sizes.length
      return sizes[index] + 'px'
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';
.tags {
  &__item {
    display: inline-block;
    padding: 12px;
    cursor: pointer;
    transition: all ease 0.38s;
  }
  &__item:hover {
    transform: scale(1.2);
  }
}
</style>
