import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewTourStore = defineStore('viewStore', {
  state: () => ({
    tourDetails: null,
  }),
  actions: {
    async fetchTourDetails(id) {
      try {
        const response = await axios.get(`${config.apiUrl}/tour/view/${id}`, {
          headers: config.getHeaders(),
        })
        const data = response.data

        // Ensure languages_supported is an array
        if (typeof data.languages_supported === 'string') {
          data.languages_supported = JSON.parse(data.languages_supported)
        }

        this.tourDetails = data
        return this.tourDetails
      } catch (error) {
        console.error('Error fetching tour details:', error)
      }
    },
  },
})
