// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import mergeAsyncData from '@/mixins/mergeAsyncData'
import { Button, Select, Tag, Card, Dropdown, DropdownMenu, DropdownItem, Pagination } from 'element-ui'
import layout from '@/views/layout/'
Vue.component('layout', layout)
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Tag.name, Tag)
Vue.use(Card)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Pagination)

// Vue.config.productionTip = false
Vue.filter('formatDate', val => {
  return moment(val).format('YYYY-MM-DD HH:mm')
})
Vue.mixin(mergeAsyncData)
Vue.prototype.$moment = moment
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
