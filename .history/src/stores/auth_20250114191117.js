import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isLoggedIn: null, // Initialize based on token
    user: null,
    message: null,
    messageType: null, // 'success' or 'danger'
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    setToken(token) {
      this.token = token
    },

    async login(email, password) {
      try {
        const response = await axios.post(
          `${config.apiUrl}/login`,
          { email, password },
          { headers: config.getHeaders() },
        )

        if (response.data.token) {
          this.token = response.data.token
          this.setMessage(response.data.message || 'Login successful', 'success')
          this.isLoggedIn = true
          return response
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || 'Login failed. Please try again.'
        this.setMessage(errorMessage, 'danger')
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isLoggedIn = false
      this.message = null
      this.messageType = null
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
