import { defineStore } from 'pinia'
import { axios } from 'axios'
import { config } from '../../config'

export const userStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login({ email, password }) {
      try {
        const response = await axios.post(`${config.apiUrl}/login`, {
          { email, password },
          { headers: config.getHeaders() }
        })

        this.token = response.data.token
        this.user = response.data.user
      } catch (error) {
        console.error(error)
      }
    },

    async logout() {
      this.token = null
      this.user = null
    },
  },
})
