import { createStore } from 'vuex'

export default createStore({
  state: {
    theme: 'chalk'
  },
  mutations: {
    changeTheme (state) {
      if (state.theme === 'chalk') {
      state.theme = 'vintage'
      } else {
      state.theme = 'chalk'
      }
      }
  },
  actions: {
  },
  modules: {
  }
})
