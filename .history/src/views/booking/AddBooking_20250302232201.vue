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
    <div>
      <label for="user_id">User ID:</label>
      <input type="number" v-model="booking.user_id" id="user_id" required />
    </div>
    <div>
      <label for="tour_id">Tour ID:</label>
      <input type="number" v-model="booking.tour_id" id="tour_id" required />
    </div>
    <div>
      <label for="merchant_id">Merchant ID:</label>
      <input type="number" v-model="booking.merchant_id" id="merchant_id" required />
    </div>
    <div>
      <label for="tour_name">Tour Name:</label>
      <input type="text" v-model="booking.tour_name" id="tour_name" required />
    </div>
    <div>
      <label for="full_name">Full Name:</label>
      <input type="text" v-model="booking.full_name" id="full_name" required />
    </div>
    <div>
      <label for="contact_number">Contact Number:</label>
      <input type="text" v-model="booking.contact_number" id="contact_number" required />
    </div>
    <div>
      <label for="hotel_name">Hotel Name:</label>
      <input type="text" v-model="booking.hotel_name" id="hotel_name" required />
    </div>
    <div>
      <label for="room_number">Room Number:</label>
      <input type="text" v-model="booking.room_number" id="room_number" required />
    </div>
    <div>
      <label for="email">Email:</label>
      <input type="email" v-model="booking.email" id="email" required />
    </div>
    <div>
      <label for="location">Location:</label>
      <input type="text" v-model="booking.location" id="location" required />
    </div>
    <div>
      <label for="booking_date">Booking Date:</label>
      <input type="datetime-local" v-model="booking.booking_date" id="booking_date" required />
    </div>
    <div>
      <label for="pick_up_time">Pick Up Time:</label>
      <input type="datetime-local" v-model="booking.pick_up_time" id="pick_up_time" required />
    </div>
    <div>
      <label for="pick_up_location">Pick Up Location:</label>
      <input type="text" v-model="booking.pick_up_location" id="pick_up_location" required />
    </div>
    <div>
      <label for="drop_off_location">Drop Off Location:</label>
      <input type="text" v-model="booking.drop_off_location" id="drop_off_location" required />
    </div>
    <div>
      <label for="drop_off_time">Drop Off Time:</label>
      <input type="datetime-local" v-model="booking.drop_off_time" id="drop_off_time" required />
    </div>
    <div>
      <label for="phone">Phone:</label>
      <input type="text" v-model="booking.phone" id="phone" required />
    </div>
    <div>
      <label for="travel_date">Travel Date:</label>
      <input type="date" v-model="booking.travel_date" id="travel_date" required />
    </div>
    <div>
      <label for="discounts">Discounts:</label>
      <input type="text" v-model="booking.discounts" id="discounts" required />
    </div>
    <div>
      <label for="transport_types">Transport Types:</label>
      <input type="text" v-model="booking.transport_types" id="transport_types" required />
    </div>
    <div>
      <label for="adult_price">Adult Price:</label>
      <input type="number" v-model="booking.adult_price" id="adult_price" required />
    </div>
    <div>
      <label for="child_price">Child Price:</label>
      <input type="number" v-model="booking.child_price" id="child_price" required />
    </div>
    <div>
      <label for="total_price">Total Price:</label>
      <input type="number" v-model="booking.total_price" id="total_price" required />
    </div>
    <div>
      <label for="payment_method">Payment Method:</label>
      <input type="number" v-model="booking.payment_method" id="payment_method" required />
    </div>
    <div>
      <label for="promo_id">Promo ID:</label>
      <input type="number" v-model="booking.promo_id" id="promo_id" required />
    </div>
    <div>
      <label for="note">Note:</label>
      <textarea v-model="booking.note" id="note" required></textarea>
    </div>
    <div>
      <label for="num_traveler_adult">Number of Adult Travelers:</label>
      <input type="number" v-model="booking.num_traveler_adult" id="num_traveler_adult" required />
    </div>
    <div>
      <label for="num_traveler_child">Number of Child Travelers:</label>
      <input type="number" v-model="booking.num_traveler_child" id="num_traveler_child" required />
    </div>
    <div>
      <label for="total_traveller">Total Travelers:</label>
      <input type="number" v-model="booking.total_traveller" id="total_traveller" required />
    </div>
    <div>
      <label for="status">Status:</label>
      <input type="text" v-model="booking.status" id="status" required />
    </div>
    <div>
      <label for="invoice_id">Invoice ID:</label>
      <input type="text" v-model="booking.invoice_id" id="invoice_id" required />
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<style>
/* Add your styles here */
</style>
