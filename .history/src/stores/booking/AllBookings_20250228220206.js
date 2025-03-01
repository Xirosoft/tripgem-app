import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useViewBookingsStore = defineStore('viewBookings', {
  state: () => ({
    merchant: null,
  }),
  actions: {
    async fetchMerchant() {
      try {
        const response = await axios.get(`${config.apiUrl}/bookings/view`, {
          headers: config.getHeaders(),
        })
        this.merchant = response.data
        return this.merchant // Return the fetched merchant data
      } catch (error) {
        console.error('Error fetching merchant:', error)
      }
    },
    async updateBooking(bookingId, updatedData) {
      try {
        const response = await axios.put(
          `${config.apiUrl}/bookings/update/${bookingId}`,
          updatedData,
          {
            headers: config.getHeaders(),
          },
        )
        return response.data // Return the updated booking data
      } catch (error) {
        console.error('Error updating booking:', error)
      }
    },
  },
})
