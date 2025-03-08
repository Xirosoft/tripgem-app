<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewBookingsStore } from '../../stores/booking/ViewBooking.js'

export default {
  name: 'ViewBooking',
  setup() {
    const viewBookingsStore = useViewBookingsStore()
    const route = useRoute()
    const bookingId = ref(route.params.id)

    onMounted(async () => {
      await viewBookingsStore.fetchBookingById(bookingId.value)
    })

    return {
      viewBookingsStore,
    }
  },
}
</script>

<template>
  <div class="content-wrapper">
    <!-- Content -->
    <div class="flex-grow-1 container-p-y container-fluid">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4">
        <div class="d-flex flex-column justify-content-center">
          <div class="mb-1">
            <span class="h5">Booking #{{ viewBookingsStore.booking.booking_id }} </span>
            <span class="badge bg-label-success me-1 ms-2">Paid</span>
            <span class="badge bg-label-info">Ready to Pickup</span>
          </div>
          <p class="mb-0">{{ viewBookingsStore.booking.booking_date }}</p>
        </div>
        <div class="d-flex align-content-center flex-wrap gap-2">
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
                    <th class="w-50">Item</th>
                    <th class="w-25">Price</th>
                    <th class="w-25">Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ viewBookingsStore.booking.tour_name }}</td>
                    <td>${{ viewBookingsStore.booking.adult_price }}</td>
                    <td>{{ viewBookingsStore.booking.num_traveler_adult }}</td>
                    <td>${{ viewBookingsStore.booking.adult_price * viewBookingsStore.booking.num_traveler_adult }}</td>
                  </tr>
                  <tr>
                    <td>Child Tour</td>
                    <td>${{ viewBookingsStore.booking.child_price }}</td>
                    <td>{{ viewBookingsStore.booking.num_traveler_child }}</td>
                    <td>${{ viewBookingsStore.booking.child_price * viewBookingsStore.booking.num_traveler_child }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end align-items-center m-6 mb-2">
                <div class="order-calculations">
                  <div class="d-flex justify-content-start mb-2">
                    <span class="w-px-100 text-heading">Subtotal:</span>
                    <h6 class="mb-0">${{ viewBookingsStore.booking.total_price }}</h6>
                  </div>
                  <div class="d-flex justify-content-start mb-2">
                    <span class="w-px-100 text-heading">Discount:</span>
                    <h6 class="mb-0">${{ viewBookingsStore.booking.discount }}</h6>
                  </div>
                  <div class="d-flex justify-content-start mb-2">
                    <span class="w-px-100 text-heading">Tax:</span>
                    <h6 class="mb-0">$0</h6>
                  </div>
                  <div class="d-flex justify-content-start">
                    <h6 class="w-px-100 mb-0">Total:</h6>
                    <h6 class="mb-0">${{ viewBookingsStore.booking.total_price }}</h6>
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
                      <h6 class="mb-0">Booking was placed (Booking ID: #{{ viewBookingsStore.booking.booking_id }})</h6>
                      <small class="text-muted">{{ viewBookingsStore.booking.booking_date }}</small>
                    </div>
                    <p class="mt-3">Your booking has been placed successfully</p>
                  </div>
                </li>
                <li class="timeline-item timeline-item-transparent border-primary">
                  <span class="timeline-point timeline-point-primary"></span>
                  <div class="timeline-event">
                    <div class="timeline-header">
                      <h6 class="mb-0">Pick-up</h6>
                      <small class="text-muted">{{ viewBookingsStore.booking.pickup_time }}</small>
                    </div>
                    <p class="mt-3 mb-3">Pick-up scheduled with courier</p>
                  </div>
                </li>
                <li class="timeline-item timeline-item-transparent border-primary">
                  <span class="timeline-point timeline-point-primary"></span>
                  <div class="timeline-event">
                    <div class="timeline-header">
                      <h6 class="mb-0">Dispatched</h6>
                      <small class="text-muted">{{ viewBookingsStore.booking.drop_time }}</small>
                    </div>
                    <p class="mt-3 mb-3">Item has been picked up by courier</p>
                  </div>
                </li>
                <li class="timeline-item timeline-item-transparent border-primary">
                  <span class="timeline-point timeline-point-primary"></span>
                  <div class="timeline-event">
                    <div class="timeline-header">
                      <h6 class="mb-0">Package arrived</h6>
                      <small class="text-muted">{{ viewBookingsStore.booking.drop_time }}</small>
                    </div>
                    <p class="mt-3 mb-3">Package arrived at the destination</p>
                  </div>
                </li>
                <li class="timeline-item timeline-item-transparent border-left-dashed">
                  <span class="timeline-point timeline-point-primary"></span>
                  <div class="timeline-event">
                    <div class="timeline-header">
                      <h6 class="mb-0">Dispatched for delivery</h6>
                      <small class="text-muted">{{ viewBookingsStore.booking.drop_time }}</small>
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
              <h5 class="card-title m-0">Customer details</h5>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-start align-items-center mb-6">
                <div class="avatar me-3">
                  <img src="../../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle">
                </div>
                <div class="d-flex flex-column">
                  <a href="app-user-view-account.html" class="text-body text-nowrap">
                    <h6 class="mb-0">{{ viewBookingsStore.booking.full_name }}</h6>
                  </a>
                  <span>Customer ID: #{{ viewBookingsStore.booking.user_id }}</span>
                </div>
              </div>
              <div class="d-flex justify-content-start align-items-center mb-6">
                <span class="avatar rounded-circle bg-label-success me-3 d-flex align-items-center justify-content-center"><i class="ti ti-shopping-cart ti-lg"></i></span>
                <h6 class="text-nowrap mb-0">12 Orders</h6>
              </div>
              <div class="d-flex justify-content-between">
                <h6 class="mb-1">Contact info</h6>
                <h6 class="mb-1">
                  <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#editUser">Edit</a>
                </h6>
              </div>
              <p class="mb-1">Email: {{ viewBookingsStore.booking.email }}</p>
              <p class="mb-0">Mobile: {{ viewBookingsStore.booking.contact_number }}</p>
            </div>
          </div>

          <div class="card mb-6">
            <div class="card-header d-flex justify-content-between">
              <h5 class="card-title m-0">Shipping address</h5>
              <h6 class="m-0">
                <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#addNewAddress">Edit</a>
              </h6>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ viewBookingsStore.booking.pick_up_location }} <br>{{ viewBookingsStore.booking.drop_location }} <br>{{ viewBookingsStore.booking.hotel_name }} <br>{{ viewBookingsStore.booking.nationality }}</p>
            </div>
          </div>
          <div class="card mb-6">
            <div class="card-header d-flex justify-content-between">
              <h5 class="card-title m-0">Billing address</h5>
              <h6 class="m-0">
            <button
              class="btn btn-primary d-grid w-100 mb-4 waves-effect waves-light"
              data-bs-toggle="offcanvas"
              data-bs-target="#sendInvoiceOffcanvas"
            >
              <span class="d-flex align-items-center justify-content-center text-nowrap"
                ><i class="ti ti-send ti-xs me-2"></i>Send Invoice</span
              >
            </button>
            <button class="btn btn-label-secondary d-grid w-100 mb-4 waves-effect">Download</button>
            <div class="d-flex mb-4">
              <a
                class="btn btn-label-secondary d-grid w-100 me-4 waves-effect"
                target="_blank"
                href="./app-invoice-print.html"
              >
                Print
              </a>
              <a
                href="./app-invoice-edit.html"
                class="btn btn-label-secondary d-grid w-100 waves-effect"
              >
                Edit
              </a>
            </div>
            <button
              class="btn btn-success d-grid w-100 waves-effect waves-light"
              data-bs-toggle="offcanvas"
              data-bs-target="#addPaymentOffcanvas"
            >
              <span class="d-flex align-items-center justify-content-center text-nowrap"
                ><i class="ti ti-currency-dollar ti-xs me-2"></i>Add Payment</span
              >
            </button>
          </div>
        </div>
      </div>
      <!-- /Invoice Actions -->
    </div>

    <!-- Offcanvas -->
    <!-- Send Invoice Sidebar -->
    <div class="offcanvas offcanvas-end" id="sendInvoiceOffcanvas" aria-hidden="true">
      <div class="offcanvas-header mb-6 border-bottom">
        <h5 class="offcanvas-title">Send Invoice</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body pt-0 flex-grow-1">
        <form>
          <div class="mb-6">
            <label for="invoice-from" class="form-label">From</label>
            <input
              type="text"
              class="form-control"
              id="invoice-from"
              value="shelbyComapny@email.com"
              placeholder="company@email.com"
            />
          </div>
          <div class="mb-6">
            <label for="invoice-to" class="form-label">To</label>
            <input
              type="text"
              class="form-control"
              id="invoice-to"
              value="qConsolidated@email.com"
              placeholder="company@email.com"
            />
          </div>
          <div class="mb-6">
            <label for="invoice-subject" class="form-label">Subject</label>
            <input
              type="text"
              class="form-control"
              id="invoice-subject"
              value="Invoice of purchased Admin Templates"
              placeholder="Invoice regarding goods"
            />
          </div>
          <div class="mb-6">
            <label for="invoice-message" class="form-label">Message</label>
            <textarea
              class="form-control"
              name="invoice-message"
              id="invoice-message"
              cols="3"
              rows="8"
            >
Dear Queen Consolidated,
          Thank you for your business, always a pleasure to work with you!
          We have generated a new invoice in the amount of $95.59
          We would appreciate payment of this invoice by 05/11/2021</textarea
            >
          </div>
          <div class="mb-6">
            <span class="badge bg-label-primary">
              <i class="ti ti-link ti-xs"></i>
              <span class="align-middle">Invoice Attached</span>
            </span>
          </div>
          <div class="mb-6 d-flex flex-wrap">
            <button
              type="button"
              class="btn btn-primary me-4 waves-effect waves-light"
              data-bs-dismiss="offcanvas"
            >
              Send
            </button>
            <button
              type="button"
              class="btn btn-label-secondary waves-effect"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- /Send Invoice Sidebar -->

    <!-- Add Payment Sidebar -->
    <div class="offcanvas offcanvas-end" id="addPaymentOffcanvas" aria-hidden="true">
      <div class="offcanvas-header border-bottom">
        <h5 class="offcanvas-title">Add Payment</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body flex-grow-1">
        <div class="d-flex justify-content-between bg-lighter p-2 mb-4">
          <p class="mb-0">Invoice Balance:</p>
          <p class="fw-medium mb-0">$5000.00</p>
        </div>
        <form>
          <div class="mb-6">
            <label class="form-label" for="invoiceAmount">Payment Amount</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input
                type="text"
                id="invoiceAmount"
                name="invoiceAmount"
                class="form-control invoice-amount"
                placeholder="100"
              />
            </div>
          </div>
          <div class="mb-6">
            <label class="form-label" for="payment-date">Payment Date</label>
            <input
              id="payment-date"
              class="form-control invoice-date flatpickr-input"
              type="text"
              readonly="readonly"
            />
          </div>
          <div class="mb-6">
            <label class="form-label" for="payment-method">Payment Method</label>
            <select class="form-select" id="payment-method">
              <option value="" selected="" disabled="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Paypal">Paypal</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="form-label" for="payment-note">Internal Payment Note</label>
            <textarea class="form-control" id="payment-note" rows="2"></textarea>
          </div>
          <div class="mb-6 d-flex flex-wrap">
            <button
              type="button"
              class="btn btn-primary me-4 waves-effect waves-light"
              data-bs-dismiss="offcanvas"
            >
              Send
            </button>
            <button
              type="button"
              class="btn btn-label-secondary waves-effect"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- /Add Payment Sidebar -->

    <!-- /Offcanvas -->
  </div>
  <!-- / Content -->

  <div class="content-backdrop fade"></div>
</template>

<style lang="less" scoped></style>
