import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchVerifiedUsers() {
      console.log('fetchVerifiedUsers method called') // Debugging statement
      this.loading = true
      try {
        const response = await axios.get(`${config.apiUrl}/users/verified`, {
          headers: config.getHeaders(),
        })
        console.log('API response:', response.data) // Debugging statement
        this.users = response.data
        console.log('Users state:', this.users) // Debugging statement
        return this.users
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch verified users:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getVerifiedUsers: (state) => state.users,
  },
})
