import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useMerchantsStore = defineStore('merchants', {
  state: () => ({
    merchants: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    async fetchMerchants() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/users/verified`, {
          headers: config.getHeaders(),
        })
        this.merchants = Array.isArray(response.data) ? response.data : response.data.data
        this.loading = false
        this.setMessage('Merchants loaded successfully', 'success')
      } catch (error) {
        console.error('Error fetching merchants:', error)
        this.error = error.message || 'Failed to fetch merchants'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    getMerchantById: (state) => {
      return (id) => state.merchants.find((merchant) => merchant.id === id)
    },
    getAllMerchants: (state) => state.merchants,
  },
})
