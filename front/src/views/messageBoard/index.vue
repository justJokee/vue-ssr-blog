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
      </div>
    </layout>
  </div>
</template>
<script>
import note from '@/components/note/'
import splitLine from '@/components/splitLine/'
import submit from '@/views/components/submit'
export default {
  name: 'messageBoard',
  components: {
    note,
    submit,
    splitLine
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
}
</style>
