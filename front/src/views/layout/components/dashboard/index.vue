<doc>
  @desc:   布局组件
  @author: justJokee 
</doc>
<template>
  <div class="dashboard">
    <introduction></introduction>
    <catalog></catalog>
  </div>
</template>
<script>
import introduction from './components/introduction'
import catalog from './components/catalog'
export default {
  name: 'dashboard',
  props: {},
  components: { introduction, catalog },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss">
.dashboard {
}
</style>
