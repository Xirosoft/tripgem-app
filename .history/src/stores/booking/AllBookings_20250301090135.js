import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewBookingsStore = defineStore('viewBookings', {
  state: () => ({
    bookings: [], // New state for bookings
  }),
  actions: {
    async fetchBookings() {
      try {
        const response = await axios.get(`${config.apiUrl}/bookings/view`, {
          headers: config.getHeaders(),
        })
        this.bookings = response.data
        // console.log('Fetched bookings:', this.bookings)

        // return this.bookings // Return the fetched bookings data
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    },
  },
})
