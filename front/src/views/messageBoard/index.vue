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
          <submit></submit>
        </div>
        <div class="message-board__list">
          <div class="message-board__total">
            <span>{{ total }}条留言</span>
          </div>
          <div class="message-board__list">
            <comments :messages="messages"></comments>
          </div>
        </div>
      </div>
    </layout>
  </div>
</template>
<script>
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
      total: 0,
      messages: []
    }
  },
  async asyncData({ route }) {
    const msgRes = await api.getMessageBoard({
      page: 1
    })
    if (msgRes.status === 200) return { messages: msgRes.data, total: msgRes.total }
  }
}
</script>
<style lang="scss">
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
}
</style>
