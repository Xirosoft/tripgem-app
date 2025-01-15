import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: {
      role: null,
      permissions: [],
    },
  },
  mutations: {
    setUserRole(state, role) {
      state.user.role = role
    },
    setUserPermissions(state, permissions) {
      state.user.permissions = permissions
    },
  },
  actions: {
    async fetchUserRole({ commit }) {
      const response = await fetch('/wp-json/tripgem/v1/roles/user-role-names/1') // Replace 1 with actual user ID
      const data = await response.json()
      commit('setUserRole', data.data.role_name)
    },
    async fetchUserPermissions({ commit }) {
      const response = await fetch('/wp-json/tripgem/v1/roles/user-role-names/1') // Replace 1 with actual user ID
      const data = await response.json()
      commit('setUserPermissions', data.data.permissions)
    },
  },
  getters: {
    userRole: (state) => state.user.role,
    userPermissions: (state) => state.user.permissions,
  },
})

export default store
