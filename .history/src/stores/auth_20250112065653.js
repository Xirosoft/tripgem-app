import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('loginToken') || null,
    user: null,
    error: null,
    message: null,
    messageType: null, // 'success' or 'danger'
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
        localStorage.setItem('loginToken', response.data.token)
        this.error = null
        this.message = response.data.message || 'Login successful'
        this.messageType = 'success'
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        this.message = error.response?.data?.message || 'Login failed'
        this.messageType = 'danger'
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.message = null
      this.messageType = null
      localStorage.removeItem('loginToken')
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
