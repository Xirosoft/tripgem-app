import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewBookingsStore = defineStore('viewBookings', {
  state: () => ({
    bookings: [], // New state for bookings
    booking: {}, // New state for a single booking
  }),
  actions: {
    async fetchBookings() {
      try {
        const response = await axios.get(`${config.apiUrl}/booking/view`, {
          headers: config.getHeaders(),
        })
        this.bookings = response.data
        // console.log('Fetched bookings:', this.bookings)

        return this.bookings // Return the fetched bookings data
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    },
    async fetchBookingById(bookingId) {
      try {
        const response = await axios.get(`${config.apiUrl}/booking/view/${bookingId}`, {
          headers: config.getHeaders(),
        })
        this.booking = response.data
        // console.log('Fetched booking:', this.booking)

        return this.booking // Return the fetched booking data
      } catch (error) {
        console.error('Error fetching booking:', error)
      }
    },
  },
})
