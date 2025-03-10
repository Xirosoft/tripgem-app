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
      user_id: '',
      tour_id: '',
      merchant_id: '',
      tour_name: '',
      full_name: '',
      contact_number: '',
      hotel_name: '',
      room_number: '',
      email: '',
      location: '',
      booking_date: '',
      pick_up_time: '',
      pick_up_location: '',
      drop_off_location: '',
      drop_off_time: '',
      phone: '',
      travel_date: '',
      discount: [], // Change discount to an array to hold multiple selected discounts
      transport_types: '',
      adult_price: '',
      child_price: '',
      total_price: '',
      payment_method: '',
      promo_id: '',
      note: '',
      num_traveler_adult: '',
      num_traveler_child: '',
      total_traveller: '',
      status: '',
      invoice_id: '',
      nationality: '', // Add nationality property
      selectedLocation: null, // Add selectedLocation property
      pick_up_time_from: '', // Add pick_up_time_from property
      pick_up_time_to: '', // Add pick_up_time_to property
      drop_time_from: '', // Add drop_time_from property
      drop_time_to: '', // Add drop_time_to property
      drop_time: '', // Add drop_time property
      selectedDropLocation: null, // Add selectedDropLocation property
      net_adult_price: '', // Add net_adult_price property
      net_child_price: '', // Add net_child_price property
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
        const response = await axios.put(
          `${config.apiUrl}/booking/edit/${this.booking.id}`,
          bookingData,
          {
            headers: config.getHeaders(),
          },
        )
        console.log('Booking updated successfully:', response.data)
      } catch (error) {
        this.error = 'Failed to update booking'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
})
