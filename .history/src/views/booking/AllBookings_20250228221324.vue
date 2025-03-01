<script>
import FilterComponent from '@/components/booking/FilterComponent.vue'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import { onMounted } from 'vue'
import { useViewBookingsStore } from '../../stores/booking/AllBookings.js'

export default {
  name: 'AllBookings',
  components: {
    FilterComponent,
  },
  setup() {
    const viewBookingsStore = useViewBookingsStore()
    const { bookings, fetchBookings } = viewBookingsStore

    onMounted(() => {
      fetchBookings()
    })

    const filterBookings = () => {
      // Implement filtering logic here
    }

    return {
      bookings,
      filterBookings,
    }
  },
}
</script>

<template>
  <div>
    <h1>All Bookings</h1>
    <FilterComponent @filter="filterBookings" />
    <table id="bookingsTable" class="table table-striped">
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Full Name</th>
          <th>Contact Number</th>
          <th>Hotel Name</th>
          <th>Room Number</th>
          <th>Email</th>
          <th>Location</th>
          <th>Booking Date</th>
          <th>Travel Date</th>
          <th>Total Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.booking_id">
          <td>{{ booking.booking_id }}</td>
          <td>{{ booking.full_name }}</td>
          <td>{{ booking.contact_number }}</td>
          <td>{{ booking.hotel_name }}</td>
          <td>{{ booking.room_number }}</td>
          <td>{{ booking.email }}</td>
          <td>{{ booking.location }}</td>
          <td>{{ booking.booking_date }}</td>
          <td>{{ booking.travel_date }}</td>
          <td>{{ booking.total_price }}</td>
          <td>{{ booking.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
/* Add your styles here */
</style>
