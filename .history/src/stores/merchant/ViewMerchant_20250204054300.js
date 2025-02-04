import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewMerchantsStore = defineStore('viewMerchant', {
  state: () => ({
    merchant: null,
  }),
  actions: {
    async fetchMerchant(id) {
      try {
        const response = await axios.get(`${config.apiUrl}/merchant/view/${id}`, {
          headers: config.getHeaders(),
        })
        this.merchant = response.data
        console.log('Fetched merchant:', this.merchant)
      } catch (error) {
        console.error('Error fetching merchant:', error)
      }
    },
  },
})
