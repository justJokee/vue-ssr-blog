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
  }
}
