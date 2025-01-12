import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('loginToken') || null,
    user: null,
    message: null,
    messageType: null, // 'success' or 'danger'
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
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
          localStorage.setItem('loginToken', response.data.token)
          this.setMessage(response.data.message || 'Login successful', 'success')
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
