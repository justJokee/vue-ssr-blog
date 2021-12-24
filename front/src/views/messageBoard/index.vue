<doc>
  @desc:   留言板
  @author: justJokee
</doc>
<template>
  <div class="message-board">
    <layout _title="留言板">
      <div class="message-board__content">
        <note>
          <p class="message-board__welcome">you must be a surprise someone is looking forward to</p>
        </note>
        <splitLine></splitLine>
        <div class="message-board__title">
          <i class="el-icon-chat-dot-round"></i>
          <span>留言</span>
        </div>
        <div class="message-board__submit">
          <submit @submitContent="submitContent"></submit>
        </div>
        <div class="message-board__list">
          <div class="message-board__total">
            <span>{{ total }}条留言</span>
          </div>
          <div class="message-board__list">
            <comments :messages="messages" @submitReply="submitReply" @addLike="addLike"></comments>
            <div class="message-board__page">
              <el-pagination
                :current-page.sync="currentPage"
                :total="total"
                layout="prev, pager, next"
                :page-size="pageSize"
                @current-change="currentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </layout>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import note from '@/components/note/'
import splitLine from '@/components/splitLine/'
import submit from '@/views/components/submit'
import comments from '@/views/components/comments'
import api from '@/api/messageBoard'

export default {
  name: 'messageBoard',
  components: {
    note,
    submit,
    splitLine,
    comments
  },
  data() {
    return {
      currentPage: 1,
      total: 0,
      pageSize: 10,
      messages: []
    }
  },
  async asyncData({ route }) {
    const msgRes = await api.getMessageBoard({
      page: 1
    })
    if (msgRes.status === 200) return { messages: msgRes.data, total: msgRes.total }
  },
  computed: {
    ...mapState(['visitorInfo'])
  },
  methods: {
    submitContent(content, cb) {
      this.submit(content, null, cb)
    },
    submitReply(content, currentReplyMessage, cb) {
      this.submit(content, currentReplyMessage, cb)
    },
    async submit(content, currentReplyMessage, cb) {
      let parentId
      let aite
      if (currentReplyMessage) {
        if (currentReplyMessage.parentId) parentId = currentReplyMessage.parentId
        else parentId = currentReplyMessage._id
        aite = currentReplyMessage.name
      }
      const res = await api.saveMessageBoard({
        name: this.visitorInfo.name,
        imgUrl: this.visitorInfo.imgUrl,
        email: this.visitorInfo.email,
        link: this.visitorInfo.link,
        content: content,
        parentId,
        aite
      })
      if (res.status === 200) {
        if (cb) cb()
        this.$message({
          type: 'success',
          message: '留言成功'
        })
        this.getMessageBoard()
      }
    },
    async getMessageBoard() {
      const msgRes = await api.getMessageBoard({
        page: this.currentPage
      })
      if (msgRes.status === 200) {
        this.messages = msgRes.data
        this.total = msgRes.total
      }
    },
    async addLike(message) {
      const inc = message.liked ? -1 : 1
      const likeRes = await api.likeMessageBoard({
        _id: message._id,
        inc
      })
      if (likeRes.status === 200) {
        let finder
        this.messages.some(msg => {
          if (msg._id === likeRes.data._id) {
            finder = msg
            return true
          }
          if (msg.reply && msg.reply.length) {
            let done = false
            msg.reply.some(er => {
              if (er._id === likeRes.data._id) {
                finder = er
                done = true
              }
            })
            return done
          }
        })
        if (finder) {
          finder.like = likeRes.data.like
          finder.liked = likeRes.data.liked
        }
        this.$message({
          type: 'success',
          message: likeRes.info
        })
      }
    },
    currentChange(val) {
      this.getMessageBoard()
    }
  }
}
</script>
<style lang="scss">
@import '~@/style/index.scss';

.message-board {
  &__welcome {
    font-family: 'sf-arch';
    font-size: 28px;
    line-height: 1.8;
  }
  &__title {
    padding: 16px 0;
    font-size: 20px;
    font-weight: 700;
    > [class^='el-icon-'] {
      font-weight: 700;
    }
    span {
      margin-left: 12px;
    }
  }
  &__list {
    margin-top: 28px;
  }
  &__total {
    color: #4c4948;
    font-size: 25px;
    font-weight: bold;
  }
  &__page {
    @include flex-box-center;
    padding: 16px 0;
  }
}
</style>
