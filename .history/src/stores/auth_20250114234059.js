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
    userEmail: '',
    userId: null,
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    setToken(token) {
      this.token = token
    },

    setIsLoggedIn(isLoggedIn) {
      if (this.token) this.isLoggedIn = isLoggedIn
    },

    setEmailId(email, id) {
      this.userEmail = email
      this.userId = id
    },

    async login(email, password) {
      try {
        const response = await axios.post(
          `${config.apiUrl}/login`,
          { email, password },
          { headers: config.getHeaders() },
        )

        if (response.data.token) {
          this.setToken(response.data.token) // Set the token
          this.setMessage(response.data.message || 'Login successful', 'success')
          this.setIsLoggedIn(true) // Set isLoggedIn to true if token is set
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
  persist: true,
})
