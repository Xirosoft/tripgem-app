<script>
import axios from 'axios'
import jQuery from 'jquery'
import select2 from 'select2'
import config from '../../config/config'
const $ = jQuery
window.$ = window.jQuery = jQuery
select2() // Initialize select2
export default {
  name: 'EditBooking',
  data() {
    return {
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
        net_price_adult: '', // Add net_adult_price property
        net_price_child: '', // Add net_child_price property
      },
      tour: null,
      error: null,
      loading: false,
      payment: {
        booking_id: '',
        amount: 0,
        payment_method: '',
        payment_status: 'Pending',
        transaction_id: '',
        bank_details: '',
        due_date: '',
        payment_slip: '',
      },
      showModal: false,
      editingPrice: {
        adult: false,
        child: false,
      },
    }
  },
  computed: {
    sidebarData() {
      const discountAmount = Array.isArray(this.booking.discount)
        ? this.booking.discount.reduce((total, discountName) => {
            const discount = this.booking.discountDetails.find((d) => d.name === discountName)
            if (discount) {
              if (discount.type === 'fixed') {
                return total + discount.amount
              } else if (discount.type === 'percentage') {
                const applicablePrice =
                  discount.target === 'adult' ? this.booking.adult_price : this.booking.child_price
                return total + (applicablePrice * discount.amount) / 100
              }
            }
            return total
          }, 0)
        : 0

      const parkFee = this.calculateParkFee()
      return {
        adultTravelers: this.booking.num_traveler_adult || 0,
        childTravelers: this.booking.num_traveler_child || 0,
        infantTravelers: this.booking.num_traveler_infant || 0,
        totalTravelers:
          (this.booking.num_traveler_adult || 0) +
          (this.booking.num_traveler_child || 0) +
          (this.booking.num_traveler_infant || 0),
        MinusTotalTravelers:
          (this.booking.num_traveler_adult || 0) + (this.booking.num_traveler_child || 0),
        totalPrice:
          (this.booking.adult_price || 0) * (this.booking.num_traveler_adult || 0) +
          (this.booking.child_price || 0) * (this.booking.num_traveler_child || 0) +
          parkFee,
        pickUpCharge: this.booking.selectedLocation ? this.booking.selectedLocation.charge || 0 : 0,
        dropOffCharge: this.booking.selectedDropLocation
          ? this.booking.selectedDropLocation.charge || 0
          : 0,
        discountAmount,
        parkFee,
      }
    },
    adultFee() {
      if (!this.booking.park_fee) return 0
      const parkFee = this.booking.park_fee
      const isLocal = this.booking.nationality === 'Thailand'
      return (
        parseFloat(this.booking.adult_park_fee) ||
        (isLocal ? parkFee.local_price_adult_park_fee : parkFee.price_adult_park_fee)
      )
    },
    childFee() {
      if (!this.booking.park_fee) return 0
      const parkFee = this.booking.park_fee
      const isLocal = this.booking.nationality === 'Thailand'
      return (
        parseFloat(this.booking.child_park_fee) ||
        (isLocal ? parkFee.local_price_child_park_fee : parkFee.price_child_park_fee)
      )
    },
  },
  methods: {
    async fetchTourData(tourId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/tour/view/${tourId}`, {
          headers: config.getHeaders(),
        })
        this.tour = response.data

        // console.log('Tour data:', this.tour)

        // this.booking = this.tour
        // this.booking.tour_id = this.tour.tour_id
        this.booking.tour_name = this.tour.tour_name
        this.booking.merchant_id = this.tour.merchant_id
        this.booking.adult_price = this.tour.regular_price_adult
        this.booking.child_price = this.tour.regular_price_child
        this.booking.net_price_adult = this.tour.net_price_adult
        this.booking.net_price_child = this.tour.net_price_child

        this.booking.total_price = this.tour.total_price
        this.booking.location = this.tour.location
        this.booking.merchant_name = this.tour.merchant_name
        this.booking.user_name = this.tour.user_name
        this.booking.available_seat = this.tour.available_seat

        this.booking.pick_up_time = this.tour.pick_up_time
        this.booking.thumbnail = this.tour.thumbnail
        this.booking.transport_types = this.tour.transport_types
        this.booking.nationality = this.tour.nationality // Set nationality
        this.booking.park_fee = JSON.parse(this.tour.park_fee)
        // console.log('Park Fee:', this.booking.park_fee)

        // this.booking.discount = this.tour.discount
        this.booking.discountDetails = JSON.parse(this.tour.discount)
        // console.log('Discount:', this.booking.discountDetails)
        this.populateDiscountOptions() // Populate discount options after fetching tour data
        this.$nextTick(() => {
          $('#multicol-country').val(this.booking.nationality).trigger('change')
        })
      } catch (error) {
        this.error = 'Failed to fetch tour data'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async fetchBookingData(bookingId) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/booking/view/${bookingId}`, {
          headers: config.getHeaders(),
        })
        this.booking = response.data
        console.log('adult_park_fee_count data:', this.booking[park_fee])
        // console.log('child_park_fee_count data:', this.booking.park_fee.child_park_fee_count)
        console.log('Booking data:', this.booking)

        await this.fetchTourData(this.booking.tour_id) // Fetch tour data using tour ID from booking
      } catch (error) {
        this.error = 'Failed to fetch booking data'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    async submitForm() {
      if (this.sidebarData.MinusTotalTravelers > this.booking.available_seat) {
        this.error = 'Not enough available seats for the selected tour.'
        return
      }
      this.showModal = true
    },
    async processPayment() {
      this.loading = true
      this.error = null
      try {
        const bookingData = {
          user_id: this.booking.user_id,
          tour_id: this.booking.tour_id,
          merchant_id: this.booking.merchant_id,
          tour_name: this.booking.tour_name,
          full_name: this.booking.full_name,
          contact_number: this.booking.contact_number,
          hotel_name: this.booking.hotel_name,
          pick_up_location: this.booking.selectedLocation?.location || '',
          drop_location: this.booking.selectedDropLocation?.location || '',
          pickup_time: this.booking.pick_up_time_from,
          drop_time: this.booking.drop_time_from,
          discount: this.booking.discount.join(', '),
          pickup_fee: this.booking.selectedLocation?.charge || 0,
          drop_fee: this.booking.selectedDropLocation?.charge || 0,
          adult_park_fee: this.booking.park_fee?.price_adult_park_fee || 0,
          child_park_fee: this.booking.park_fee?.price_child_park_fee || 0,
          num_adult_park: this.booking.num_traveler_adult,
          num_child_park: this.booking.num_traveler_child,
          total_park_fee: this.calculateParkFee(),
          room_number: this.booking.room_number,
          email: this.booking.email,
          nationality: this.booking.nationality,
          booking_date: new Date().toISOString(),
          travel_date: this.booking.travel_date,
          adult_price: this.booking.adult_price,
          child_price: this.booking.child_price,
          total_price: this.sidebarData.totalPrice,
          payment_method: this.booking.payment_method,
          promo_id: this.booking.promo_id,
          note: this.booking.note,
          num_traveler_infant: this.booking.num_traveler_infant,
          num_traveler_adult: this.booking.num_traveler_adult,
          num_traveler_child: this.booking.num_traveler_child,
          total_traveller: this.sidebarData.totalTravelers,
          status: this.booking.status,
          invoice_id: this.booking.invoice_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          net_price_adult: parseFloat(this.booking.net_price_adult),
          net_price_child: parseFloat(this.booking.net_price_child),
        }

        const bookingResponse = await axios.put(
          `${config.apiUrl}/booking/edit/${this.booking.id}`,
          bookingData,
          {
            headers: config.getHeaders(),
          },
        )
        const bookingId = bookingResponse.data.id

        const paymentData = {
          booking_id: bookingId,
          amount: this.sidebarData.totalPrice,
          payment_method: this.payment.payment_method,
          payment_status: 'due',
          transaction_id: this.payment.transaction_id,
          bank_details: this.payment.bank_details,
          due_date: this.payment.due_date,
          payment_slip: this.payment.payment_slip,
        }

        const paymentResponse = await axios.post(`${config.apiUrl}/payment/add`, paymentData, {
          headers: config.getHeaders(),
        })
        console.log('Payment successful:', paymentResponse.data)

        // Update available seats
        const updatedAvailableSeats =
          this.booking.available_seat - this.sidebarData.MinusTotalTravelers
        await axios.put(
          `${config.apiUrl}/tour/edit/${this.booking.tour_id}`,
          {
            tour_id: this.booking.tour_id,
            available_seat: updatedAvailableSeats,
          },
          {
            headers: config.getHeaders(),
          },
        )
        console.log('Available seats updated successfully')

        this.showModal = false
        // Handle successful payment (e.g., redirect to a confirmation page)
        this.clearDiscountOptions() // Clear discount options after successful booking
      } catch (error) {
        this.error = 'Failed to process payment'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.payment.payment_slip = e.target.result
      }
      reader.readAsDataURL(file)
    },
    parseLocation(location) {
      if (!location) {
        return ''
      }
      try {
        const parsedLocation = JSON.parse(location)
        return parsedLocation[0]?.name || ''
      } catch (error) {
        console.error('Error parsing location:', error)
        return ''
      }
    },
    parsePickupLocations(pick_up_time) {
      // console.log('Pick up time:', pick_up_time)

      if (!pick_up_time) {
        return []
      }
      try {
        const parsedLocation = JSON.parse(pick_up_time)
        return parsedLocation.map((loc) => ({
          location: loc.location,
          charge: loc.charge,
          from: loc.from,
          to: loc.to,
        }))
      } catch (error) {
        console.error('Error parsing pickup locations:', error)
        return []
      }
    },
    updatePickupTimes() {
      if (this.booking.selectedLocation) {
        this.booking.pick_up_time_from = this.booking.selectedLocation.from
        this.booking.pick_up_time_to = this.booking.selectedLocation.to
      } else {
        this.booking.pick_up_time_from = ''
        this.booking.pick_up_time_to = ''
      }
    },
    updateDropTimes() {
      if (this.booking.selectedDropLocation) {
        this.booking.drop_time_from = this.booking.selectedDropLocation.from
        this.booking.drop_time_to = this.booking.selectedDropLocation.to
      } else {
        this.booking.drop_time_from = ''
        this.booking.drop_time_to = ''
      }
    },
    parseDropLocations(drop_time) {
      // console.log('Drop time:', drop_time)

      if (!drop_time) {
        return []
      }
      try {
        const parsedLocation = JSON.parse(drop_time)
        return parsedLocation.map((drloc) => ({
          location: drloc.location,
          charge: drloc.charge,
          from: drloc.from,
          to: drloc.to,
        }))
      } catch (error) {
        // console.error('Error parsing drop locations:', error)
        return []
      }
    },
    clearDiscountOptions() {
      this.booking.discount = []
      $('#discount').val(null).trigger('change')
    },
    populateDiscountOptions() {
      const discountSelect = $('#discount')
      discountSelect.empty()
      discountSelect.append(new Option('Select Discount', '', true, true))
      this.booking.discountDetails.forEach((discount) => {
        const option = new Option(
          discount.name + ' - ฿' + discount.amount + ' - ' + discount.type,
          discount.name,
        )
        discountSelect.append(option)
      })
      discountSelect.trigger('change')
    },
    calculateParkFee() {
      return (
        this.adultFee * (this.booking.adult_park_fee_count || 0) +
        this.childFee * (this.booking.child_park_fee_count || 0)
      )
    },
  },
  mounted() {
    const bookingId = this.$route.params.id
    if (bookingId) {
      this.fetchBookingData(bookingId)
    }
    this.$nextTick(() => {
      $('#multicol-country')
        .select2({
          allowClear: true,
        })
        .on('change', (e) => {
          this.booking.nationality = e.target.value
          this.calculateParkFee()
        })
      $('#discount')
        .select2({
          multiple: true,
          allowClear: true,
        })
        .on('change', (e) => {
          this.booking.discount = $(e.target).val()
        })
      $('#input_adult_park_fee').on('input', (e) => {
        this.booking.adult_park_fee = e.target.value
        this.calculateParkFee()
      })
      $('#input_child_park_fee').on('input', (e) => {
        this.booking.child_park_fee = e.target.value
        this.calculateParkFee()
      })
    })
  },
}
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-if="error" class="alert alert-danger">{{ error }}</div>
  <form @submit.prevent="submitForm">
    <div class="row">
      <!-- Personal Info Block -->
    </div>
    <div class="row cart-page">
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-12">
            <ul class="list-group mb-4">
              <li class="list-group-item p-6">
                <div class="d-flex gap-4">
                  <div class="flex-shrink-0 d-flex align-items-center">
                    <img :src="booking.thumbnail" alt="google home" class="w-px-150" />
                  </div>
                  <div class="flex-grow-1">
                    <div class="row">
                      <div class="col-md-8">
                        <p class="me-3 mb-2">
                          <a href="javascript:void(0)" class="fw-medium">
                            <span class="text-heading">{{ booking.tour_name }}</span></a
                          >
                        </p>
                        <div class="text-muted mb-2 d-flex flex-wrap">
                          <span class="me-1">Operator:</span>
                          <a href="javascript:void(0)" class="me-4">{{ booking.merchant_name }}</a>
                          <span class="badge bg-label-success">Available Seat </span>
                          <b> {{ booking.available_seat }}</b>
                        </div>
                        <div
                          class="read-only-ratings mb-2 jq-ry-container"
                          data-rateyo-read-only="true"
                          readonly="readonly"
                          style="width: 128px"
                        ></div>
                        <div class="row g-3">
                          <div class="col-md-4">
                            <div class="d-flex flex-column">
                              <span>Adult</span>
                              <input
                                type="number"
                                class="form-control form-control-sm"
                                value="{{ booking.num_traveler_adult }}"
                                min="1"
                                max="5"
                                v-model="booking.num_traveler_adult"
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="d-flex flex-column">
                              <span>Child</span>
                              <input
                                type="number"
                                class="form-control form-control-sm"
                                value="0"
                                min="0"
                                max="35"
                                v-model="booking.num_traveler_child"
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="d-flex flex-column">
                              <span>Infant</span>
                              <input
                                type="number"
                                class="form-control form-control-sm"
                                value="0"
                                min="0"
                                max="35"
                                v-model="booking.num_traveler_infant"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="text-md-end">
                          <button
                            type="button"
                            class="btn-close btn-pinned"
                            aria-label="Close"
                          ></button>
                          <br />
                          <!-- <p><b>Price</b></p> -->
                          <div class="mt-md- mb-md-1">
                            <span class="text-primary">Adult Price:</span>
                            <span v-if="!editingPrice.adult" @click="editingPrice.adult = true">
                              {{ booking.adult_price }}
                            </span>
                            <input
                              v-else
                              type="number"
                              class="form-control form-control-sm"
                              v-model="booking.adult_price"
                              min="0"
                              @blur="editingPrice.adult = false"
                            />
                          </div>
                          <div class="mt-md- mb-md-1">
                            <span class="text-primary">Child Price:</span>
                            <span v-if="!editingPrice.child" @click="editingPrice.child = true">
                              {{ booking.child_price }}
                            </span>
                            <input
                              v-else
                              type="number"
                              class="form-control form-control-sm"
                              v-model="booking.child_price"
                              min="0"
                              @blur="editingPrice.child = false"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-12 mt-4">
                        <div v-if="booking.park_fee" class="row park-fee-block">
                          <div class="col-lg-6">
                            <div class="row g-3">
                              <div class="col-6">
                                <div class="d-flex flex-column">
                                  <label class="form-label mb-1">Adult Park Fee</label>
                                  <input
                                    type="number"
                                    class="form-control form-control-sm"
                                    value="0"
                                    min="0"
                                    max="35"
                                    id="input_adult_park_fee"
                                    v-model="booking.adult_park_fee_count"
                                  />
                                </div>
                              </div>
                              <div class="col-6">
                                <div class="d-flex flex-column">
                                  <label class="form-label mb-1">Child Park Fee</label>
                                  <input
                                    type="number"
                                    class="form-control form-control-sm"
                                    value="0"
                                    min="0"
                                    max="35"
                                    id="input_child_park_fee"
                                    v-model="booking.child_park_fee_count"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-lg-6">
                            <div class="">
                              <h6 class="mb-1">Park Fee Details</h6>
                              <div class="d-flex justify-content-between mb-0">
                                <span>Adult Fee:</span>
                                <span class="text-primary fw-bold"> ฿{{ adultFee || 0 }} </span>
                              </div>
                              <div class="d-flex justify-content-between">
                                <span>Child Fee:</span>
                                <span class="text-primary fw-bold"> ฿{{ childFee || 0 }} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col-12 peronal-info">
            <div class="row">
              <div class="col-12">
                <h5 class="mb-4">Personal Information</h5>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="full_name">Full Name [Lead Traveler]</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-user"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="booking.full_name"
                    id="full_name"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="contact_number">Contact Number</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-phone"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="booking.contact_number"
                    id="contact_number"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="email">Email</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-mail"></i></span>
                  <input
                    type="email"
                    class="form-control"
                    v-model="booking.email"
                    id="email"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="phone">Nationality</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-phone"></i></span>
                  <select
                    id="multicol-country"
                    class="select2 form-select"
                    v-model="booking.nationality"
                    data-allow-clear="true"
                    @change="calculateParkFee"
                  >
                    <option value="">Select</option>
                    <option value="Australia">Australia</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Thailand">Thailand</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 booking">
            <div class="row">
              <h5 class="mb-4">Booking Information</h5>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="hotel_name">Hotel Name</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-building"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="booking.hotel_name"
                    id="hotel_name"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="room_number">Room Number</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-number"></i></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="booking.room_number"
                    id="room_number"
                    required
                  />
                </div>
              </div>

              <div class="col-md-4 mb-6">
                <label class="form-label" for="pick_up_location">Pick Up Location</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-map-pin"></i></span>
                  <select
                    class="form-select"
                    v-model="booking.selectedLocation"
                    @change="updatePickupTimes"
                    required
                  >
                    <option value="">Select Location</option>
                    <option
                      v-for="location in parsePickupLocations(booking.pick_up_time)"
                      :key="location.location"
                      :value="location"
                    >
                      {{ location.location }} ({{
                        location.charge ? '฿' + location.charge : 'Free'
                      }})
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4 mb-6">
                <label class="form-label" for="pick_up_time_from">Pick Up Time From</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-clock"></i></span>
                  <input
                    type="time"
                    class="form-control"
                    v-model="booking.pick_up_time_from"
                    id="pick_up_time_from"
                    required
                    :disabled="!booking.selectedLocation"
                  />
                </div>
              </div>
              <div class="col-md-4 mb-6">
                <label class="form-label" for="pick_up_time_to">Pick Up Time To</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-clock"></i></span>
                  <input
                    type="time"
                    class="form-control"
                    v-model="booking.pick_up_time_to"
                    id="pick_up_time_to"
                    required
                    :disabled="!booking.selectedLocation"
                  />
                </div>
              </div>
              <div class="col-md-4 mb-6">
                <label class="form-label" for="drop_off_location">Drop Off Location</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-map-pin"></i></span>
                  <select
                    class="form-select"
                    v-model="booking.selectedDropLocation"
                    @change="updateDropTimes"
                    required
                  >
                    <option value="">Select Location</option>
                    <option
                      v-for="location in parseDropLocations(booking.drop_time)"
                      :key="location.location"
                      :value="location"
                    >
                      {{ location.location }} ({{ location.charge ? +location.charge : 'Free' }})
                    </option>
                  </select>
                </div>
              </div>
              <div class="col-md-4 mb-6">
                <label class="form-label" for="drop_time_from">Drop Off Time From</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-clock"></i></span>
                  <input
                    type="time"
                    class="form-control"
                    v-model="booking.drop_time_from"
                    id="drop_time_from"
                    required
                    :disabled="!booking.selectedDropLocation"
                  />
                </div>
              </div>
              <div class="col-md-4 mb-6">
                <label class="form-label" for="drop_time_to">Drop Off Time To</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-clock"></i></span>
                  <input
                    type="time"
                    class="form-control"
                    v-model="booking.drop_time_to"
                    id="drop_time_to"
                    required
                    :disabled="!booking.selectedDropLocation"
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="travel_date">Travel Date</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-calendar"></i></span>
                  <input
                    type="date"
                    class="form-control"
                    v-model="booking.travel_date"
                    id="travel_date"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="discount">Discount</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-tag"></i></span>
                  <select class="form-select" id="discount" multiple required>
                    <option value="">Select Discount</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="net_adult_price">Net Adult Price</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-money"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.net_price_adult"
                    id="net_adult_price"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="net_child_price">Net Child Price</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-money"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.net_price_child"
                    id="net_child_price"
                    required
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Booking Info Block -->
          <div class="col-12">
            <h5 class="mb-4">Tour Information</h5>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="user_id">Reservation By</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-user"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.user_name"
                id="user_id"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="tour_id">Tour ID</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-building"></i></span>
              <input
                type="number"
                class="form-control"
                v-model="booking.tour_id"
                id="tour_id"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="merchant_id">Tour Oparator</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-building"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.merchant_name"
                id="merchant_id"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="tour_name">Tour Name</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-building"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.tour_name"
                id="tour_name"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="location">Location</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-location"></i></span>
              <input
                type="text"
                class="form-control"
                :value="parseLocation(booking.location)"
                id="location"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="booking_date">Booking Date</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-calendar"></i></span>
              <input
                type="date"
                class="form-control"
                :value="new Date().toISOString().split('T')[0]"
                id="booking_date"
                readonly
                required
              />
            </div>
          </div>

          <div class="col-md-6 mb-6">
            <label class="form-label" for="transport_types">Transport Types</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-car"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.transport_types"
                id="transport_types"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="note">Note</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-message-dots"></i></span>
              <textarea
                class="form-control"
                v-model="booking.note"
                id="note"
                required
                style="height: 38px"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="border rounded p-6 mb-4 sticky-sidebar">
          <!-- Offer -->
          <h6>Offer</h6>
          <div class="row g-4 mb-4">
            <div class="col-8 col-xxl-8 col-xl-12">
              <input
                type="text"
                class="form-control"
                placeholder="Enter Promo Code"
                aria-label="Enter Promo Code"
              />
            </div>
            <div class="col-4 col-xxl-4 col-xl-12">
              <div class="d-grid">
                <button type="button" class="btn btn-label-primary waves-effect">Apply</button>
              </div>
            </div>
          </div>
          <!-- Price Details -->
          <h6>Price Details</h6>
          <dl class="row mb-0 text-heading">
            <dt class="col-8 fw-normal">
              Adult Travelers - {{ sidebarData.adultTravelers }} x {{ booking.adult_price }}
            </dt>
            <dd class="col-4 text-end">{{ sidebarData.adultTravelers * booking.adult_price }}</dd>
            <dt class="col-8 fw-normal">
              Child Travelers - {{ sidebarData.childTravelers }} x {{ booking.child_price }}
            </dt>
            <dd class="col-4 text-end">{{ sidebarData.childTravelers * booking.child_price }}</dd>
            <dt class="col-8 fw-normal">Infant Travelers - {{ sidebarData.infantTravelers }}</dt>
            <dd class="col-4 text-end">Free</dd>
            <hr />
            <dt class="col-8 fw-normal">Total Travelers</dt>
            <dd class="col-4 text-end">{{ sidebarData.totalTravelers }}</dd>

            <dt class="col-6 fw-normal">Total Booking</dt>
            <dd class="col-6 text-end">{{ sidebarData.totalPrice }}</dd>
            <hr />
            <h6><b>Pick and Drop charge</b></h6>
            <dt class="col-6 fw-normal">
              Pick from {{ booking.selectedLocation?.location || 'N/A' }}
            </dt>
            <dd class="col-6 text-end">
              <span>{{ sidebarData.pickUpCharge ? '฿' + sidebarData.pickUpCharge : 'Free' }}</span>
            </dd>

            <dt class="col-6 fw-normal">
              Drop To {{ booking.selectedDropLocation?.location || 'N/A' }}
            </dt>
            <dd class="col-6 text-end">
              <span>{{
                sidebarData.dropOffCharge ? '฿' + sidebarData.dropOffCharge : 'Free'
              }}</span>
            </dd>

            <dt class="col-6 fw-normal">Park Fee</dt>
            <dd class="col-6 text-end">{{ sidebarData.parkFee }}</dd>

            <dt class="col-6 fw-normal">Coupon Discount</dt>
            <dd class="col-6 text-end">-{{ sidebarData.discountAmount }}</dd>
          </dl>

          <hr class="mx-n6 my-6" />
          <dl class="row mb-0">
            <dt class="col-6 text-heading">Total</dt>
            <dd class="col-6 fw-medium text-end text-heading mb-0">
              {{
                sidebarData.totalPrice +
                sidebarData.pickUpCharge +
                sidebarData.dropOffCharge -
                sidebarData.discountAmount
              }}
            </dd>
          </dl>
          <br />
          <br />
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-next waves-effect waves-light">
              Place Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>

  <!-- Payment Modal -->
  <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Payment</h5>
          <button type="button" class="btn-close" @click="showModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="payment_method" class="form-label">Payment Method</label>
            <select v-model="payment.payment_method" class="form-select" id="payment_method">
              <option value="1" disabled>PayPal</option>
              <option value="2" disabled>Stripe</option>
              <option value="3">Bank Transfer</option>
              <option value="3">Scan Transfer</option>
              <option value="4" disabled>Credit Card</option>
              <option value="5">Due</option>
            </select>
          </div>
          <div v-if="payment.payment_method === '1' || payment.payment_method === '3'" class="mb-3">
            <label for="payment_slip" class="form-label">Upload Payment Slip</label>
            <input type="file" class="form-control" id="payment_slip" @change="handleFileUpload" />
            <div class="mb-3">
              <label for="transaction_id" class="form-label">Transaction ID</label>
              <input
                type="text"
                v-model="payment.transaction_id"
                class="form-control"
                id="transaction_id"
              />
            </div>
          </div>
          <div v-if="payment.payment_method === '5'" class="mb-3">
            <label for="due_date" class="form-label">Due Date</label>
            <input type="date" v-model="payment.due_date" class="form-control" id="due_date" />
          </div>
          <div v-if="payment.payment_method === '4'" class="mb-3">
            <label for="bank_details" class="form-label">Bank Details</label>
            <input
              type="text"
              v-model="payment.bank_details"
              class="form-control"
              id="bank_details"
            />
            <div class="mb-3">
              <label for="transaction_id" class="form-label">Transaction ID</label>
              <input
                type="text"
                v-model="payment.transaction_id"
                class="form-control"
                id="transaction_id"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
          <button type="button" class="btn btn-primary" @click="processPayment">
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.sticky-sidebar {
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
}
.cart-page .select2-container {
  box-sizing: border-box;
  display: inline-block;
  margin: 0;
  position: relative;
  vertical-align: middle;
  position: relative;
  flex: 1 1 auto;
  width: 1% !important;
  min-width: 0;
}
.cart-page input {
  text-transform: capitalize;
}
</style>
