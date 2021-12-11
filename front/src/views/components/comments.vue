<doc>
  @desc:   留言、文章评论展示
  @author: justJokee
</doc>
<template>
  <div class="comments">
    <div class="comments__top" v-for="(msg, index) in messages" :key="index">
      <comments-item :message="msg"></comments-item>
      <div class="comments__sub" v-if="msg.reply && msg.reply.length">
        <comments-item
          v-for="(reply, _index) in msg.reply"
          :key="'reply_' + _index"
          :message="reply"
          :subType="true"
        ></comments-item>
      </div>
    </div>
  </div>
</template>
<script>
import commentsItem from './comments-item.vue'
export default {
  name: 'comments',
  props: {
    messages: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    commentsItem
  }
}
</script>
<style lang="scss">
.comments {
  color: #4c4948;
  &__top {
  }
  &__sub {
    padding-left: 50px;
  }
}
</style>
