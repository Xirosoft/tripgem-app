import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config/config'

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
        const response = await axios.get(`${config.apiUrl}/merchants/view`, {
          headers: config.getHeaders(),
        })
        this.merchants = response.data
        this.loading = false
        this.setMessage('Merchants loaded successfully', 'success')
      } catch (error) {
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

export default [
  {
    product: 'Product 1',
    category: 'Category 1',
    stock: 'In Stock',
    sku: 'SKU001',
    price: 99.99,
    qty: 100,
    status: 'Active',
  },
  // Add more products as needed
]
