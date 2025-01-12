// filepath: /Applications/XAMPP/xamppfiles/htdocs/tripgem/src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'
import config from '@/config/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('loginToken') || '',
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post(
          `${config.apiUrl}/login`,
          { email, password },
          { headers: config.getHeaders() },
        )
        this.token = response.data.token
        localStorage.setItem('loginToken', this.token)
        return response.data
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.token = ''
      localStorage.removeItem('loginToken')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})
