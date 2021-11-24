<doc>
  @desc:   留言板
  @author: justJokee
</doc>
<template>
  <div class="message-board">
    <layout title="留言板">
      <div class="message-board__content">
        <note>
          <p class="message-board__welcome">i am wating for you</p>
        </note>
      </div>
    </layout>
  </div>
</template>
<script>
import note from '@/components/note/'

export default {
  name: 'messageBoard',
  components: {
    note
  }
}
</script>
<style lang="scss">
.message-board {
  &__welcome {
    font-family: 'sf-arch';
    font-size: 28px;
  }
}
</style>
