import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import app from './modules/app'
import settings from './modules/settings'
import getters from './getters'
import tagsView from './modules/tagsView'
import permission from './modules/permission'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    app,
    settings,
    tagsView,
    permission
  },
  getters
})
export default store
