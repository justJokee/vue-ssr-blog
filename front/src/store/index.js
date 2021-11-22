import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)
export function createStore() {
  return new Vuex.Store({
    state: {
      articles: {
        sum: 0,
        all: [],
        technical: [],
        life: [],
        search: [],
        only: [],
        time: [],
        hot: [],
        pre_next: { pre: [], next: [] }
      },
      tags: [], //后端传来的数据模型[{tag: "",num: ""}]
      comments: [],
      msgBoardArr: [],
      timeLine: [],
      pageArr: [],
      tagBg: [],
      userInfo: { name: '', imgUrl: '', email: '' },
      maskShow: false,
      tabBg: false,
      currentTitle: '',
      anchorScroll: { top: 0, move: 0 },
      code: 404,
      // new=====>>>>
      activeCatalog: '',
      rollBack: false,
      catalogs: []
    },
    mutations,
    actions
  })
}
