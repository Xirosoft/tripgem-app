import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useTourSearchStore = defineStore('tourSearch', {
  state: () => ({
    tours: [],
  }),
  actions: {
    async fetchTours(searchParams) {
      try {
        const response = await axios.get(`${config.apiUrl}/tours/search`, {
          headers: config.getHeaders(),
          params: searchParams,
        })
        this.tours = response.data
        return this.tours
      } catch (error) {
        console.error('Error fetching tours:', error)
      }
    },
  },
})
