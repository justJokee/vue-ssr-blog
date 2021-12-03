export default {
  setCatalogs(state, catalogs) {
    state.catalogs = catalogs
  },
  setActiveCatalog(state, id) {
    state.activeCatalog = id
  },
  setRollBack(state, rollBack) {
    state.rollBack = rollBack
  },
  setVisitor(state, info) {
    state.visitorInfo = info
  },
  // ==== >>>> old
  pageArray(state, data) {
    let pageNum = Math.ceil(data / 8)
    let arr = []
    for (let i = 1; i < pageNum + 1; i++) {
      arr.push(i)
    }
    state.pageArr = arr
  },
  set_user(state, info) {
    state.userInfo = info
  },
  changeCode(state, code) {
    state.code = code
  },
  changeTitle(state, title) {
    state.currentTitle = title
  },
  handleMask(state, bool) {
    state.maskShow = bool
  },
  addTabBg(state, bool) {
    state.tabBg = bool
  },
  addLocalComments(state, info) {
    if (info.type === 1) {
      state.comments.unshift(info.add)
    } else {
      state.comments.forEach((item, index, arr) => {
        if (item._id === info._id) {
          state.comments.splice(index, 1, info.add)
          return
        }
      })
    }
  },
  addLocalCommentsLike(state, info) {
    if (info.rep_id) {
      state.comments.forEach((item, index, arr) => {
        if (item._id === info.rev_id) {
          item.reply.forEach((_item, _index, _arr) => {
            if (_item._id === info.rep_id) {
              _item.like += info.type
              return
            }
          })
        }
      })
    } else {
      state.comments.forEach((item, index, arr) => {
        if (item._id === info.rev_id) {
          item.like += info.type
          return
        }
      })
    }
  },
  addLocalWords(state, info) {
    if (info.type === 1) {
      state.msgBoardArr.unshift(info.add)
    } else {
      state.msgBoardArr.forEach((item, index, arr) => {
        if (item._id === info._id) {
          state.msgBoardArr.splice(index, 1, info.add)
          return
        }
      })
    }
  },
  productBg(state, data) {
    state.tagBg = []
    let pattern = /^[\u4e00-\u9fa5]+$/
    data.forEach((item, index, arr) => {
      if (item.tag[0] === '服务器' || item.tag[0] === 'apache' || item.tag[0] === 'tomcat') {
        state.tagBg.push('webserver')
      } else if (item.tag[0] === '云服务器') {
        state.tagBg.push('cloundserver')
      } else if (item.tag[0] === '安全') {
        state.tagBg.push('safe')
      } else if (item.tag[0] === '响应式') {
        state.tagBg.push('response')
      } else if (pattern.test(item.tag[0])) {
        state.tagBg.push('')
      } else {
        state.tagBg.push(item.tag[0])
      }
    })
  },
  positionTop(state, payload) {
    state.anchorScroll = { top: payload.top, move: payload.move }
  },
  clear(state) {
    state.pageArr = []
  }
}
