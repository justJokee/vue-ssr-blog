<doc>
  @desc:   留言、文章评论展示
  @author: justJokee
</doc>
<template>
  <div class="comments">
    <div class="comments__top" v-for="(msg, index) in messages" :key="index">
      <comments-item
        :message="msg"
        @changeCurrentReplyMessage="changeCurrentReplyMessage"
        @addLike="addLike"
      ></comments-item>
      <submit
        v-if="msg._id === currentReplyMessage._id"
        :currentReplyMessage="currentReplyMessage"
        @changeCurrentReplyMessage="changeCurrentReplyMessage"
        @submitContent="submitContent"
      ></submit>
      <div class="comments__sub" v-if="msg.reply && msg.reply.length">
        <template v-for="(reply, _index) in msg.reply">
          <comments-item
            :key="'reply_' + _index"
            :message="reply"
            :subType="true"
            @addLike="addLike"
            @changeCurrentReplyMessage="changeCurrentReplyMessage"
          ></comments-item>
          <submit
            v-if="reply._id === currentReplyMessage._id"
            :key="_index"
            :currentReplyMessage="currentReplyMessage"
            @submitContent="submitContent"
            @changeCurrentReplyMessage="changeCurrentReplyMessage"
          ></submit>
        </template>
      </div>
    </div>
    <div class="comments__empty" v-if="!messages.length">emm...没人理我</div>
  </div>
</template>
<script>
import commentsItem from './comments-item.vue'
import submit from './submit'
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
  data() {
    return {
      currentReplyMessage: {}
    }
  },
  components: {
    commentsItem,
    submit
  },
  methods: {
    submitContent(content, cb) {
      this.$emit('submitReply', content, this.currentReplyMessage, cb)
    },
    changeCurrentReplyMessage(message) {
      this.currentReplyMessage = message
    },
    addLike(message) {
      this.$emit('addLike', message)
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.comments {
  @include themeify() {
    color: themed('color-comments');
  }
  &__top {
  }
  &__sub {
    padding-left: 50px;
    @include respond-to(xs) {
      padding-left: 20px;
    }
  }

  &__empty {
    padding: 16px;
    text-align: center;
    @include themeify() {
      color: themed('color-ele-holder');
    }
  }
}
</style>
