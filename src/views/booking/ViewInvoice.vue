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
  <!-- Content -->
  <div class="flex-grow-1 container-p-y container-fluid">
    <div class="row invoice-preview">
      <!-- Invoice -->
      <div class="col-xl-9 col-md-8 col-12 mb-md-0 mb-6">
        <div class="card invoice-preview-card p-sm-12 p-6">
          <div class="card-body invoice-preview-header rounded">
            <div
              class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column"
            >
              <div class="mb-xl-0 mb-6 text-heading">
                <div class="d-flex svg-illustration mb-6 gap-2 align-items-center">
                  <div class="app-brand-logo demo">
                    <svg
                      width="32"
                      height="22"
                      viewBox="0 0 32 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                        fill="#7367F0"
                      ></path>
                      <path
                        opacity="0.06"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                        fill="#161616"
                      ></path>
                      <path
                        opacity="0.06"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                        fill="#161616"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                        fill="#7367F0"
                      ></path>
                    </svg>
                  </div>
                  <span class="app-brand-text fw-bold fs-4 ms-50"> Vuexy </span>
                </div>
                <p class="mb-2">{{ viewBookingsStore.booking.hotel_name }}</p>
                <p class="mb-2">{{ viewBookingsStore.booking.pick_up_location }}</p>
                <p class="mb-0">{{ viewBookingsStore.booking.contact_number }}</p>
              </div>
              <div>
                <h5 class="mb-6">Invoice #{{ viewBookingsStore.booking.invoice_id }}</h5>
                <div class="mb-1 text-heading">
                  <span>Date Issues:</span>
                  <span>{{ viewBookingsStore.booking.booking_date }}</span>
                </div>
                <div class="text-heading">
                  <span>Date Due:</span>
                  <span>{{ viewBookingsStore.booking.travel_date }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body px-0">
            <div class="row">
              <div class="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-6 mb-sm-0 mb-6">
                <h6>Invoice To:</h6>
                <p class="mb-1">{{ viewBookingsStore.booking.full_name }}</p>
                <p class="mb-1">{{ viewBookingsStore.booking.hotel_name }}</p>
                <p class="mb-1">{{ viewBookingsStore.booking.pick_up_location }}</p>
                <p class="mb-1">{{ viewBookingsStore.booking.contact_number }}</p>
                <p class="mb-0">{{ viewBookingsStore.booking.email }}</p>
              </div>
              <div class="col-xl-6 col-md-12 col-sm-7 col-12">
                <h6>Bill To:</h6>
                <table>
                  <tbody>
                    <tr>
                      <td class="pe-4">Total Due:</td>
                      <td class="fw-medium">${{ viewBookingsStore.booking.total_price }}</td>
                    </tr>
                    <tr>
                      <td class="pe-4">Pickup Fee:</td>
                      <td>${{ viewBookingsStore.booking.pickup_fee }}</td>
                    </tr>
                    <tr>
                      <td class="pe-4">Drop Fee:</td>
                      <td>${{ viewBookingsStore.booking.drop_fee }}</td>
                    </tr>
                    <tr>
                      <td class="pe-4">Total Park Fee:</td>
                      <td>${{ viewBookingsStore.booking.total_park_fee }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="table-responsive border border-bottom-0 border-top-0 rounded">
            <table class="table m-0">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-nowrap text-heading">
                    {{ viewBookingsStore.booking.tour_name }}
                  </td>
                  <td class="text-nowrap">Tour</td>
                  <td>${{ viewBookingsStore.booking.adult_price }}</td>
                  <td>{{ viewBookingsStore.booking.num_traveler_adult }}</td>
                  <td>
                    ${{
                      viewBookingsStore.booking.adult_price *
                      viewBookingsStore.booking.num_traveler_adult
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="text-nowrap text-heading">Child Tour</td>
                  <td class="text-nowrap">Tour</td>
                  <td>${{ viewBookingsStore.booking.child_price }}</td>
                  <td>{{ viewBookingsStore.booking.num_traveler_child }}</td>
                  <td>
                    ${{
                      viewBookingsStore.booking.child_price *
                      viewBookingsStore.booking.num_traveler_child
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-responsive">
            <table class="table m-0 table-borderless">
              <tbody>
                <tr>
                  <td class="align-top pe-6 ps-0 py-6">
                    <p class="mb-1">
                      <span class="me-2 h6">Salesperson:</span>
                      <span>Alfie Solomons</span>
                    </p>
                    <span>Thanks for your business</span>
                  </td>
                  <td class="px-0 py-6 w-px-100">
                    <p class="mb-2">Subtotal:</p>
                    <p class="mb-2">Discount:</p>
                    <p class="mb-2 border-bottom pb-2">Tax:</p>
                    <p class="mb-0 pt-2">Total:</p>
                  </td>
                  <td class="text-end px-0 py-6 w-px-100 fw-medium text-heading">
                    <p class="fw-medium mb-2">${{ viewBookingsStore.booking.total_price }}</p>
                    <p class="fw-medium mb-2">${{ viewBookingsStore.booking.discount }}</p>
                    <p class="fw-medium mb-2 border-bottom pb-2">21%</p>
                    <p class="fw-medium mb-0 pt-2">${{ viewBookingsStore.booking.total_price }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr class="mt-0 mb-6" />
          <div class="card-body p-0">
            <div class="row">
              <div class="col-12">
                <span class="fw-medium text-heading">Note:</span>
                <span>{{ viewBookingsStore.booking.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Invoice -->

      <!-- Invoice Actions -->
      <div class="col-xl-3 col-md-4 col-12 invoice-actions">
        <div class="card">
          <div class="card-body">
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
