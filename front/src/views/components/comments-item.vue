<doc>
  @desc:   留言、文章评论展示列表
  @author: justJokee
</doc>
<template>
  <div class="comments-item">
    <div class="comments-item__avatar" :class="{ 'comments-item__avatar--small': subType }">
      <img :src="message.imgUrl" alt="" />
    </div>
    <div class="comments-item__content">
      <div class="comments-item__visitor">
        <span class="detail-visitor-name">{{ message.name }}</span>
        <span class="detail-visitor-aite" v-if="message.aite" style="fontWeight:bold">&nbsp;@&nbsp;</span>
        <span class="detail-visitor-aited" v-if="message.aite">{{ message.aite }}</span>
      </div>

      <div class="comments-item__say">{{ message.content }}</div>

      <div class="comments-item__detail">
        <i class="el-icon-date"></i>
        <span class="detail-visitor-date">{{ message.date | formatDate }}</span>
        <i class="el-icon-thumb"></i>
        <span>{{ message.like }}</span>
        <i class="el-icon-chat-dot-round" @click="changeCurrentReplyMessage(message)"></i>
        <span>{{ message | replycCount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'commentsItem',
  props: {
    subType: {
      type: Boolean,
      default: false
    },
    message: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {},
  filters: {
    replycCount(message) {
      if (message.reply && message.reply.length) return message.reply.length
      return ''
    }
  },
  methods: {
    changeCurrentReplyMessage(message) {
      this.$emit('changeCurrentReplyMessage', message)
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.comments-item {
  display: flex;
  padding: 14px 0;
  border-bottom: 1px solid rgb(245, 240, 240);
  &__content {
    flex: 1 1 auto;
    padding-left: 20px;
  }
  &__avatar {
    width: 50px;
    height: 50px;
    flex: 0 0 auto;
    img {
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
  }
  &__avatar--small {
    width: 36px;
    height: 36px;
  }
  &__visitor {
    height: 50px;
    .detail-visitor-name {
    }
    .detail-visitor-aite {
    }
    .detail-visitor-aited {
    }
  }
  &__detail {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // color: #909399;
    @include themeify() {
      color: themed('color-home-article-detail');
    }
    margin-top: 10px;
    i {
      font-size: 16px;
      margin-left: 12px;
      // font-weight: 600;
    }
    i:hover {
      color: #409eff;
    }
    span {
      margin-left: 6px;
    }
    .el-icon-thumb,
    .el-icon-chat-dot-round {
      cursor: pointer;
    }
  }
  &__say {
  }
}
</style>
