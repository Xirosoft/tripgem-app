import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewBookingsStore = defineStore('viewBooking', {
  state: () => ({
    bookings: [],
    booking: {},
  }),
  actions: {
    async fetchBookingById(bookingId) {
      try {
        const response = await axios.get(`${config.apiUrl}/booking/view/${bookingId}`, {
          headers: config.getHeaders(),
        })
        this.booking = response.data
        return this.booking
      } catch (error) {
        console.error('Error fetching booking:', error)
      }
    },
  },
})
