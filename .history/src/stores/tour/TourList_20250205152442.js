import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useTourListStore = defineStore('tourList', {
  state: () => ({
    tourList: [],
  }),
  actions: {
    async fetchTourList() {
      try {
        const response = await axios.get(`${config.apiUrl}/tours/view`, {
          headers: config.getHeaders(),
        })
        this.tourList = response.data
      } catch (error) {
        console.error('Error fetching tour list:', error)
      }
    },
  },
})
