import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

import auth from './modules/auth'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    auth,
  }
})
