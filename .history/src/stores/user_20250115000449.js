import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

const userId = useAuthStore.userId

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVerifiedUsers() {
      this.loading = true
      try {
        const response = await axios.get(`${config.apiUrl}/users/details/${id}`, {
          headers: config.getHeaders(),
        })
        this.users = response.data
        return this.users
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getVerifiedUsers: (state) => state.users,
    getUserFullName: (state) => (userId) => {
      const user = state.users.find((u) => u.user_id === userId)
      return user ? `${user.first_name} ${user.last_name}` : ''
    },
  },
})
