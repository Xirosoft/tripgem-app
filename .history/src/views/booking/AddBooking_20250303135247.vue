<script>
import axios from 'axios'
import jQuery from 'jquery'
import select2 from 'select2'
import config from '../../config/config'
const $ = jQuery
window.$ = window.jQuery = jQuery
select2() // Initialize select2
export default {
  name: 'AddBooking',
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
        discounts: '',
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
      },
      tour: null,
      error: null,
      loading: false,
    }
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
        console.log('Tour data:', this.tour)

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
        this.booking.pick_up_time = this.tour.pick_up_time
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
        const response = await axios.post(`${config.apiUrl}/booking/add`, this.booking, {
          headers: config.getHeaders(),
        })
        console.log('Booking successful:', response.data)
        // Handle successful booking (e.g., redirect to a confirmation page)
      } catch (error) {
        this.error = 'Failed to submit booking'
        console.error(error)
      } finally {
        this.loading = false
      }
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
  },
  mounted() {
    const tourId = this.$route.params.id
    if (tourId) {
      this.fetchTourData(tourId)
    }
    this.$nextTick(() => {
      $('#multicol-country')
        .select2({
          allowClear: true,
        })
        .on('change', (e) => {
          this.booking.nationality = e.target.value
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
    <div class="row">
      <div class="col-md-9">
        <div class="row">
          <div class="col-12 peronal-info">
            <div class="row">
              <div class="col-12">
                <h5 class="mb-4">Personal Information</h5>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="full_name">Full Name</label>
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
                  >
                    <option value="">Select</option>
                    <option value="Australia">Australia</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Canada">Canada</option>
                    <option value="China">China</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Korea">Korea, Republic of</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Russia">Russian Federation</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
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

              <div class="col-md-6 mb-6">
                <label class="form-label" for="num_traveler_adult">Number of Adult Travelers</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-user"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.num_traveler_adult"
                    id="num_traveler_adult"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="num_traveler_child">Number of Child Travelers</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-user"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.num_traveler_child"
                    id="num_traveler_child"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="num_traveler_child"
                  >Number of Infant Travelers</label
                >
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-user"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.num_traveler_infant"
                    id="num_traveler_child"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="total_traveller">Total Travelers</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-user"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    :value="
                      Number(booking.num_traveler_adult || 0) +
                      Number(booking.num_traveler_child || 0) +
                      Number(booking.num_traveler_infant || 0)
                    "
                    id="total_traveller"
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="adult_price">Adult Price</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-currency-baht"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.adult_price"
                    id="adult_price"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="child_price">Child Price</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-currency-baht"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    v-model="booking.child_price"
                    id="child_price"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="col-md-6 mb-6">
                <label class="form-label" for="total_price">Total Price</label>
                <div class="input-group input-group-merge">
                  <span class="input-group-text"><i class="ti ti-currency-baht"></i></span>
                  <input
                    type="number"
                    class="form-control"
                    :value="
                      Number(booking.adult_price || 0) * Number(booking.num_traveler_adult || 0) +
                      Number(booking.child_price || 0) * Number(booking.num_traveler_child || 0)
                    "
                    id="total_price"
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
                  ></textarea>
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
                  {{ location.location }} ({{ location.charge ? '฿' + location.charge : 'Free' }})
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6 mb-6">
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
          <div class="col-md-6 mb-6">
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
          <div class="col-md-6 mb-6">
            <label class="form-label" for="pick_up_location">Pick Up Location</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-building"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.pick_up_location"
                id="pick_up_location"
                required
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="drop_off_location">Drop Off Location</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-building"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.drop_off_location"
                id="drop_off_location"
                required
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="drop_off_time">Drop Off Time</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-calendar"></i></span>
              <input
                type="datetime-local"
                class="form-control"
                v-model="booking.drop_off_time"
                id="drop_off_time"
                required
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
            <label class="form-label" for="discounts">Discounts</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-tag"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.discounts"
                id="discounts"
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
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="payment_method">Payment Method</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-credit-card"></i></span>
              <input
                type="number"
                class="form-control"
                v-model="booking.payment_method"
                id="payment_method"
                required
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="promo_id">Promo ID</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-tag"></i></span>
              <input
                type="number"
                class="form-control"
                v-model="booking.promo_id"
                id="promo_id"
                required
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="status">Status</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-check"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.status"
                id="status"
                required
                readonly
              />
            </div>
          </div>
          <div class="col-md-6 mb-6">
            <label class="form-label" for="invoice_id">Invoice ID</label>
            <div class="input-group input-group-merge">
              <span class="input-group-text"><i class="ti ti-receipt"></i></span>
              <input
                type="text"
                class="form-control"
                v-model="booking.invoice_id"
                id="invoice_id"
                required
              />
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

          <!-- Gift wrap -->
          <div class="bg-lighter rounded p-6">
            <h6 class="mb-2">Buying gift for a loved one?</h6>
            <p class="mb-2">Gift wrap and personalized message on card, Only for $2.</p>
            <a href="javascript:void(0)" class="fw-medium">Add a gift wrap</a>
          </div>
          <hr class="mx-n6 my-6" />

          <!-- Price Details -->
          <h6>Price Details</h6>
          <dl class="row mb-0 text-heading">
            <dt class="col-6 fw-normal">Bag Total</dt>
            <dd class="col-6 text-end">$1198.00</dd>

            <dt class="col-6 fw-normal">Coupon Discount</dt>
            <dd class="col-6 text-end"><a href="javascript:void(0)">Apply Coupon</a></dd>

            <dt class="col-6 fw-normal">Order Total</dt>
            <dd class="col-6 text-end">$1198.00</dd>

            <dt class="col-6 fw-normal">Delivery Charges</dt>
            <dd class="col-6 text-end">
              <s class="text-muted">$5.00</s>
              <span class="badge bg-label-success ms-1">Free</span>
            </dd>
          </dl>

          <hr class="mx-n6 my-6" />
          <dl class="row mb-0">
            <dt class="col-6 text-heading">Total</dt>
            <dd class="col-6 fw-medium text-end text-heading mb-0">$1198.00</dd>
          </dl>
        </div>
        <div class="d-grid">
          <button type="submit" class="btn btn-primary btn-next waves-effect waves-light">
            Place Booking
          </button>
        </div>
      </div>
    </div>
  </form>
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

@import 'select2/dist/css/select2.min.css';
</style>
