import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewStore = defineStore('viewStore', {
  state: () => ({
    tourDetails: null,
  }),
  actions: {
    async fetchTourDetails(id) {
      try {
        const response = await axios.get(`${config.apiUrl}/tripgem/v1/tour/view/${id}`, {
          headers: config.getHeaders(),
        })
        this.tourDetails = response.data
      } catch (error) {
        console.error('Error fetching tour details:', error)
      }
    },
  },
})
