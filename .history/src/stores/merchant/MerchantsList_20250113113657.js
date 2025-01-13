import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../../config/config'

export const useMerchantsStore = defineStore('merchantsList', {
  state: () => ({
    merchants: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMerchants() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/merchants`, {
          headers: config.getHeaders(),
        })

        // Handle different response formats
        if (response.data.data) {
          this.merchants = response.data.data
        } else if (Array.isArray(response.data)) {
          this.merchants = response.data
        } else {
          console.warn('Unexpected response format:', response.data)
          this.merchants = []
        }

        console.log('Fetched merchants:', this.merchants)
        return this.merchants
      } catch (error) {
        console.error('Error fetching merchants:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },

  getters: {
    getAllMerchants: (state) => state.merchants,
  },
})
