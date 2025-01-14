import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const useUsersStore = defineStore('users', {
  state: () => ({
    user: null,
    role: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUserDetails() {
      const userId = useAuthStore().userId
      this.loading = true
      try {
        const response = await axios.get(`${config.apiUrl}/users/details/${userId}`, {
          headers: config.getHeaders(),
        })
        this.user = response.data
        await this.fetchUserRole(this.user.role_id)
        console.log(response.data)
        return this.user
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchUserRole(roleId) {
      try {
        const response = await axios.get(`${config.apiUrl}/roles/user-role-names/${roleId}`, {
          headers: config.getHeaders(),
        })
        this.role = response.data.data.role_name
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
  },

  getters: {
    getUser: (state) => state.user,
    getUserFullName: (state) => {
      return state.user ? `${state.user.first_name} ${state.user.last_name}` : ''
    },
    getUserRole: (state) => {
      return state.role || ''
    },
  },
})
