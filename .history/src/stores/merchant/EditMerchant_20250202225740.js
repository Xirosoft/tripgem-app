import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useEditMerchantStore = defineStore('editMerchant', {
  state: () => ({
    merchant: null,
  }),
  actions: {
    async fetchMerchantById(id) {
      try {
        const response = await axios.get(`${config.apiUrl}/merchant/${id}`, {
          headers: config.getHeaders(),
        })
        this.merchant = response.data
        return response
      } catch (error) {
        console.error('Failed to fetch merchant data:', error)
        throw error
      }
    },
    async updateMerchant(id, data) {
      try {
        const response = await axios.put(`${config.apiUrl}/merchant/edit/${id}`, data, {
          headers: config.getHeaders(),
        })
        return response
      } catch (error) {
        console.error('Failed to update merchant:', error)
        throw error
      }
    },
  },
})
