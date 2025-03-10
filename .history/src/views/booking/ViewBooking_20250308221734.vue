<script>
import md5 from 'md5'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewBookingsStore } from '../../stores/booking/ViewBooking.js'

export default {
  name: 'ViewBooking',
  setup() {
    const viewBookingsStore = useViewBookingsStore()
    const route = useRoute()
    const bookingId = ref(route.params.id)

    console.log('Booking ID:', bookingId.value)

    onMounted(async () => {
      if (typeof viewBookingsStore.fetchBookingById === 'function') {
        await viewBookingsStore.fetchBookingById(bookingId.value)
      } else {
        console.error('fetchBookingById is not a function')
      }
    })

    return {
      viewBookingsStore,
      booking: computed(() => viewBookingsStore.booking || {}),
      md5,
    }
  },
}
</script>

<template>
  <div
    class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4"
  >
    <div class="d-flex flex-column justify-content-center">
      <div class="mb-1">
        <span class="h5">Booking #{{ booking.booking_id }} </span>
        <span class="badge bg-label-success me-1 ms-2">Paid</span>
        <span class="badge bg-label-info">Ready to Pickup</span>
      </div>
      <p class="mb-0">{{ booking.booking_date }}</p>
    </div>
    <div class="d-flex align-content-center flex-wrap gap-2">
      <router-link
        :to="'/view-tour/' + booking.tour_id"
        class="btn btn-label-info delete-order waves-effect"
        >View Tour</router-link
      >
      <router-link
        :to="'/edit-booking/' + booking.booking_id"
        class="btn btn-label-primary delete-order waves-effect"
        >Edit Tour</router-link
      >
      <button class="btn btn-label-danger delete-order waves-effect">Delete Booking</button>
    </div>
  </div>

  <!-- Booking Details Table -->
  <div class="row">
    <div class="col-12 col-lg-8">
      <div class="card mb-6">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="card-title m-0">Booking details</h5>
          <h6 class="m-0"><a href="javascript:void(0)">Edit</a></h6>
        </div>
        <div class="card-datatable table-responsive">
          <table class="datatables-order-details table border-top">
            <thead>
              <tr>
                <th class="w-50">Tour Details</th>
                <th class="w-25">Price</th>
                <th class="w-25">Pax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ booking.tour_name }}</td>
                <td>${{ booking.adult_price }}</td>
                <td>{{ booking.num_traveler_adult }}</td>
                <td>${{ booking.adult_price * booking.num_traveler_adult }}</td>
              </tr>
              <tr>
                <td>Child Tour</td>
                <td>${{ booking.child_price }}</td>
                <td>{{ booking.num_traveler_child }}</td>
                <td>${{ booking.child_price * booking.num_traveler_child }}</td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-end align-items-center m-6 mb-2">
            <div class="order-calculations">
              <div class="d-flex justify-content-start mb-2">
                <span class="w-px-100 text-heading">Subtotal:</span>
                <h6 class="mb-0">${{ booking.total_price }}</h6>
              </div>
              <div class="d-flex justify-content-start mb-2">
                <span class="w-px-100 text-heading">Discount:</span>
                <h6 class="mb-0">${{ booking.discount }}</h6>
              </div>
              <div class="d-flex justify-content-start mb-2">
                <span class="w-px-100 text-heading">Tax:</span>
                <h6 class="mb-0">$0</h6>
              </div>
              <div class="d-flex justify-content-start">
                <h6 class="w-px-100 mb-0">Total:</h6>
                <h6 class="mb-0">${{ booking.total_price }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card mb-6">
        <div class="card-header">
          <h5 class="card-title m-0">Booking activity</h5>
        </div>
        <div class="card-body pt-1">
          <ul class="timeline pb-0 mb-0">
            <li class="timeline-item timeline-item-transparent border-primary">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header">
                  <h6 class="mb-0">Booking was placed (Booking ID: #{{ booking.booking_id }})</h6>
                  <small class="text-muted">{{ booking.booking_date }}</small>
                </div>
                <p class="mt-3">Your booking has been placed successfully</p>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent border-primary">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header">
                  <h6 class="mb-0">Pick-up</h6>
                  <small class="text-muted">{{ booking.pickup_time }}</small>
                </div>
                <p class="mt-3 mb-3">Pick-up scheduled with courier</p>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent border-primary">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header">
                  <h6 class="mb-0">Dispatched</h6>
                  <small class="text-muted">{{ booking.drop_time }}</small>
                </div>
                <p class="mt-3 mb-3">Item has been picked up by courier</p>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent border-primary">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header">
                  <h6 class="mb-0">Package arrived</h6>
                  <small class="text-muted">{{ booking.drop_time }}</small>
                </div>
                <p class="mt-3 mb-3">Package arrived at the destination</p>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent border-left-dashed">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header">
                  <h6 class="mb-0">Dispatched for delivery</h6>
                  <small class="text-muted">{{ booking.drop_time }}</small>
                </div>
                <p class="mt-3 mb-3">Package has left the facility</p>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent border-transparent pb-0">
              <span class="timeline-point timeline-point-secondary"></span>
              <div class="timeline-event pb-0">
                <div class="timeline-header">
                  <h6 class="mb-0">Delivery</h6>
                </div>
                <p class="mt-1 mb-0">Package will be delivered by tomorrow</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4">
      <div class="card mb-6">
        <div class="card-header">
          <h5 class="card-title m-0">Merchant details</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-start align-items-center mb-6">
            <div class="avatar me-3">
              <img
                v-if="booking.email"
                :src="`https://www.gravatar.com/avatar/${md5(booking.email)}?s=200&d=mp`"
                alt="Avatar"
                class="rounded-circle"
              />
            </div>
            <div class="d-flex flex-column">
              <a href="app-user-view-account.html" class="text-body text-nowrap">
                <h6 class="mb-0">{{ booking.full_name }}</h6>
              </a>
              <span>Customer ID: #{{ booking.user_id }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start align-items-center mb-6">
            <span
              class="avatar rounded-circle bg-label-success me-3 d-flex align-items-center justify-content-center"
              ><i class="ti ti-users ti-26px"></i
            ></span>
            <h6 class="text-nowrap mb-0">10209 Booking Done</h6>
          </div>
          <div class="d-flex justify-content-between">
            <h6 class="mb-1">Contact info</h6>
            <h6 class="mb-1">
              <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#editUser"
                >Edit</a
              >
            </h6>
          </div>
          <p class="mb-1">Email: {{ booking.email }}</p>
          <p class="mb-0">Mobile: {{ booking.contact_number }}</p>
        </div>
      </div>
      <div class="card mb-6">
        <div class="card-header">
          <h5 class="card-title m-0">Customer details</h5>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-start align-items-center mb-6">
            <div class="avatar me-3">
              <img
                v-if="booking.email"
                :src="`https://www.gravatar.com/avatar/${md5(booking.email)}?s=200&d=mp`"
                alt="Avatar"
                class="rounded-circle"
              />
            </div>
            <div class="d-flex flex-column">
              <a href="app-user-view-account.html" class="text-body text-nowrap">
                <h6 class="mb-0">{{ booking.full_name }}</h6>
              </a>
              <span>Customer ID: #{{ booking.user_id }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-start align-items-center mb-6">
            <span
              class="avatar rounded-circle bg-label-success me-3 d-flex align-items-center justify-content-center"
              ><i class="ti ti-users ti-26px"></i
            ></span>
            <h6 class="text-nowrap mb-0">
              {{
                Number(booking.num_traveler_infant || 0) +
                Number(booking.num_traveler_child || 0) +
                Number(booking.num_traveler_adult || 0)
              }}
              Pax
            </h6>
          </div>
          <div class="d-flex justify-content-between">
            <h6 class="mb-1">Contact info</h6>
            <h6 class="mb-1">
              <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#editUser"
                >Edit</a
              >
            </h6>
          </div>
          <p class="mb-1">Email: {{ booking.email }}</p>
          <p class="mb-0">Mobile: {{ booking.contact_number }}</p>
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-header d-flex justify-content-between">
          <h5 class="card-title m-0">Pick & Drop Address</h5>
          <h6 class="m-0">
            <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addNewAddress"
              >Edit</a
            >
          </h6>
        </div>
        <div class="card-body">
          <p class="mb-1">
            <b>Hotel: </b><span>{{ booking.hotel_name }}</span>
          </p>
          <p class="mb-1">
            <b>Room: </b><span>{{ booking.room_number }}</span>
          </p>
          <p class="mb-1">
            <b>Drop: </b><span>{{ booking.drop_location }} </span>
          </p>
          <p class="mb-1">
            <b>Nationality: </b> <span>{{ booking.nationality }} </span>
          </p>
        </div>
      </div>
      <div class="card mb-6">
        <div class="card-header d-flex justify-content-between">
          <h5 class="card-title m-0">Billing address</h5>
          <h6 class="m-0">
            <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addNewAddress"
              >Edit</a
            >
          </h6>
        </div>
        <div class="card-body">
          <p>
            Invoice ID: <span>{{ booking.invoice_id }}</span>
          </p>
          <p class="mb-6">
            {{ booking.pick_up_location }} <br />{{ booking.drop_location }} <br />{{
              booking.hotel_name
            }}
            <br />{{ booking.nationality }}
          </p>

          <h6 class="mb-1">Payment Method</h6>
          <p class="mb-0">{{ booking.payment_method }}</p>
          <h6 class="mb-1">Mastercard</h6>
          <p class="mb-0">Card Number: ******4291</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
