// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import mergeAsyncData from '@/mixins/mergeAsyncData'
import { Button, Select, Tag, Card, Dropdown, DropdownMenu, DropdownItem } from 'element-ui'
import layout from '@/views/layout/'
Vue.component('layout', layout)
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Tag.name, Tag)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.filter('reviseTime', function(value) {
  let localTime = new Date(value)
  let year = localTime.getFullYear()
  let month = localTime.getMonth() + 1
  let day = localTime.getDate()
  let hours = localTime.getHours()
  let minutes = localTime.getMinutes()
  // seconds = localTime.getSeconds(),
  let finTime
  for (let i = 0; i < 10; i++) {
    if (i === minutes) {
      minutes = '0' + minutes
    }
  }
  finTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes
  // + ":" +seconds
  return finTime
})
// Vue.config.productionTip = false
Vue.mixin(mergeAsyncData)
/* eslint-disable no-new */
export function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
