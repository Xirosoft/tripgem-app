import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useTourListStore = defineStore('tourList', {
  state: () => ({
    tourList: [],
  }),
  actions: {
    async fetchTourList() {
      const userId = useAuthStore().userId
      try {
        const response = await axios.get(`${config.apiUrl}/tours/view/${userId}`, {
          headers: config.getHeaders(),
        })
        this.tourList = response.data
        console.log('Tour list:', this.tourList)
      } catch (error) {
        console.error('Error fetching tour list:', error)
      }
    },
  },
})
