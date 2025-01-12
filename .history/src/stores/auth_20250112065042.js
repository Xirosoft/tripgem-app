import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config/config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('loginToken') || null,
    user: null,
    error: null,
    messsage: 'null',
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
        this.messsage = response.data.message
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        this.messsage = error.response?.data?.message || 'Login failed'
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.messsage = null
      localStorage.removeItem('loginToken')
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
})
