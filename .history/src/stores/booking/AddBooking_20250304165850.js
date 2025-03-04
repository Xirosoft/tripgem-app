import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useAddBookingStore = defineStore('addBooking', {
  state: () => ({
    bookings: [],
    tour: null,
    error: null,
    loading: false,
    booking: {
      tour_id: null,
      tour_name: '',
      merchant_id: null,
      merchant_name: '',
      user_name: '',
      adult_price: 0,
      child_price: 0,
      total_price: 0,
      location: '',
      available_seat: 0,
      pick_up_time: '',
      thumbnail: '',
      park_fee: {},
      discount: 0,
      discountDetails: {},
      number_of_adult: 0,
      number_of_child: 0,
      booking_date: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      special_request: '',
    },
  }),
  actions: {
    async fetchBookings() {
      try {
        const response = await axios.get(`${config.apiUrl}/booking/add`, {
          headers: config.getHeaders(),
        })
        this.bookings = response.data
        return this.bookings
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    },
    async fetchTourData(tourId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/tour/view/${tourId}`, {
          headers: config.getHeaders(),
        })
        this.tour = response.data
        this.booking = this.tour
        this.booking.tour_id = this.tour.tour_id
        this.booking.tour_name = this.tour.tour_name
        this.booking.merchant_id = this.tour.merchant_id
        this.booking.adult_price = this.tour.regular_price_adult
        this.booking.child_price = this.tour.regular_price_child
        this.booking.total_price = this.tour.total_price
        this.booking.location = this.tour.location
        this.booking.merchant_name = this.tour.merchant_name
        this.booking.user_name = this.tour.user_name
        this.booking.available_seat = this.tour.available_seat
        this.booking.pick_up_time = this.tour.pick_up_time
        this.booking.thumbnail = this.tour.thumbnail
        this.booking.park_fee = JSON.parse(this.tour.park_fee)
        this.booking.discount = this.tour.discount
        this.booking.discountDetails = JSON.parse(this.tour.discount)
      } catch (error) {
        this.error = 'Failed to fetch tour data'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async submitForm() {
      this.loading = true
      this.error = null
      try {
        const bookingData = {
          // ...existing booking data properties...
        }
        const response = await axios.post(`${config.apiUrl}/booking/add`, bookingData, {
          headers: config.getHeaders(),
        })
        console.log('Booking successful:', response.data)
      } catch (error) {
        this.error = 'Failed to submit booking'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
})
