<script>
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
      },
    }
  },
  methods: {
    submitForm() {
      // Handle form submission
      console.log(this.booking)
    },
  },
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="mb-6">
      <label class="form-label" for="user_id">User ID</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-user"></i></span>
        <input type="number" class="form-control" v-model="booking.user_id" id="user_id" required />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="tour_id">Tour ID</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-building"></i></span>
        <input type="number" class="form-control" v-model="booking.tour_id" id="tour_id" required />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="merchant_id">Merchant ID</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-building"></i></span>
        <input
          type="number"
          class="form-control"
          v-model="booking.merchant_id"
          id="merchant_id"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="tour_name">Tour Name</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-building"></i></span>
        <input
          type="text"
          class="form-control"
          v-model="booking.tour_name"
          id="tour_name"
          required
        />
      </div>
    </div>
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="form-label" for="room_number">Room Number</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-building"></i></span>
        <input
          type="text"
          class="form-control"
          v-model="booking.room_number"
          id="room_number"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="email">Email</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-mail"></i></span>
        <input type="email" class="form-control" v-model="booking.email" id="email" required />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="location">Location</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-building"></i></span>
        <input type="text" class="form-control" v-model="booking.location" id="location" required />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="booking_date">Booking Date</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-calendar"></i></span>
        <input
          type="datetime-local"
          class="form-control"
          v-model="booking.booking_date"
          id="booking_date"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="pick_up_time">Pick Up Time</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-calendar"></i></span>
        <input
          type="datetime-local"
          class="form-control"
          v-model="booking.pick_up_time"
          id="pick_up_time"
          required
        />
      </div>
    </div>
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="form-label" for="phone">Phone</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-phone"></i></span>
        <input type="text" class="form-control" v-model="booking.phone" id="phone" required />
      </div>
    </div>
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="form-label" for="adult_price">Adult Price</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-currency-dollar"></i></span>
        <input
          type="number"
          class="form-control"
          v-model="booking.adult_price"
          id="adult_price"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="child_price">Child Price</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-currency-dollar"></i></span>
        <input
          type="number"
          class="form-control"
          v-model="booking.child_price"
          id="child_price"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="total_price">Total Price</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-currency-dollar"></i></span>
        <input
          type="number"
          class="form-control"
          v-model="booking.total_price"
          id="total_price"
          required
        />
      </div>
    </div>
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="form-label" for="note">Note</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-message-dots"></i></span>
        <textarea class="form-control" v-model="booking.note" id="note" required></textarea>
      </div>
    </div>
    <div class="mb-6">
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
    <div class="mb-6">
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
    <div class="mb-6">
      <label class="form-label" for="total_traveller">Total Travelers</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-user"></i></span>
        <input
          type="number"
          class="form-control"
          v-model="booking.total_traveller"
          id="total_traveller"
          required
        />
      </div>
    </div>
    <div class="mb-6">
      <label class="form-label" for="status">Status</label>
      <div class="input-group input-group-merge">
        <span class="input-group-text"><i class="ti ti-check"></i></span>
        <input type="text" class="form-control" v-model="booking.status" id="status" required />
      </div>
    </div>
    <div class="mb-6">
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
    <button type="submit" class="btn btn-primary waves-effect waves-light">Submit</button>
  </form>
</template>

<style>
/* Add your styles here */
</style>
