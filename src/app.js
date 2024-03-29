// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import loadEle from '@/utils/loadEle'
import App from './App.vue'
import moment from 'moment'
import api from '@/api/'
import empty from '@/components/empty'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

import mergeAsyncData from '@/mixins/mergeAsyncData'
// Vue.config.productionTip = false
Vue.filter('formatDate', (val) => {
  return moment(val).format('YYYY-MM-DD HH:mm')
})
Vue.mixin(mergeAsyncData)
Vue.prototype.$moment = moment
Vue.prototype.$api = api
Vue.component('empty', empty)
Vue.config.devtools = true
/* eslint-disable no-new */
export function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: (h) => h(App)
  })

  return { app, router, store }
}
