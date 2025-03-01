<script>
import FilterComponent from '@/components/booking/FilterComponent.vue'
import axios from 'axios'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
import { useViewBookingsStore } from '../../stores/booking/AllBookings.js'

export default {
  name: 'AllBookings',
  components: {
    FilterComponent,
  },
  setup() {
    const viewBookingsStore = useViewBookingsStore()
    const { bookings, fetchBookings } = viewBookingsStore
    const table = ref(null)
    const toast = useToast()
    const filtersAdded = ref(false)

    console.log('Bookings:', bookings)

    onMounted(async () => {
      await fetchBookings()
      initializeDataTable()
    })

    const initializeDataTable = () => {
      if (table.value) {
        table.value.destroy()
      }
      table.value = $('#bookingsTable').DataTable({
        data: bookings,
        columns: [
          { data: 'booking_id' },
          { data: 'full_name' },
          { data: 'contact_number' },
          { data: 'hotel_name' },
          { data: 'room_number' },
          { data: 'email' },
          { data: 'location' },
          { data: 'booking_date' },
          { data: 'travel_date' },
          { data: 'total_price' },
          { data: 'status' },
          {
            data: null,
            defaultContent: `
              <div class="d-inline-block">
                <a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="ti ti-dots-vertical"></i>
                </a>
                <div class="dropdown-menu">
                  <a class="dropdown-item view-booking" href="javascript:void(0);"><i class="ti ti-eye me-1"></i>View</a>
                  <a class="dropdown-item edit-booking" href="javascript:void(0);"><i class="ti ti-pencil me-1"></i>Edit</a>
                  <a class="dropdown-item text-danger delete-booking" href="javascript:void(0);"><i class="ti ti-trash me-1"></i>Delete</a>
                </div>
              </div>
            `,
          },
        ],
        order: [[0, 'desc']],
        dom:
          '<"card-header d-flex border-top rounded-0 flex-wrap py-0 flex-column flex-md-row align-items-start"' +
          '<"me-5 ms-n4 pe-5 mb-n6 mb-md-0"f>' +
          '<"d-flex justify-content-start justify-content-md-end align-items-baseline"<"dt-action-buttons d-flex flex-column align-items-start align-items-sm-center justify-content-sm-center pt-0 gap-sm-4 gap-sm-0 flex-sm-row"lB>>' +
          '>t' +
          '<"row"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          '>',
        buttons: [
          {
            extend: 'collection',
            className: 'btn btn-label-secondary dropdown-toggle me-4',
            text: '<i class="ti ti-upload me-1 ti-xs"></i>Export',
            buttons: [
              {
                extend: 'print',
                text: '<i class="ti ti-printer me-2" ></i>Print',
                className: 'dropdown-item',
              },
              {
                extend: 'csv',
                text: '<i class="ti ti-file me-2" ></i>CSV',
                className: 'dropdown-item',
              },
              {
                extend: 'excel',
                text: '<i class="ti ti-file-export me-2"></i>Excel',
                className: 'dropdown-item',
              },
              {
                extend: 'pdf',
                text: '<i class="ti ti-file-text me-2"></i>PDF',
                className: 'dropdown-item',
              },
            ],
          },
          {
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add Booking</span>',
            className: 'add-new btn btn-primary ms-2 ms-sm-0',
            action: () => {
              // Add booking action
            },
          },
        ],
      })

      // Add delete button handler
      $('#bookingsTable').on('click', '.delete-booking', (e) => {
        const data = table.value.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          confirmDeleteBooking(data.booking_id)
        }
      })

      // Add view button handler
      $('#bookingsTable').on('click', '.view-booking', (e) => {
        const data = table.value.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          viewBooking(data.booking_id)
        }
      })

      // Add edit button handler
      $('#bookingsTable').on('click', '.edit-booking', (e) => {
        const data = table.value.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          editBooking(data.booking_id)
        }
      })

      // Add filters if not already added
      if (!filtersAdded.value) {
        addFilters(table.value)
        filtersAdded.value = true
      }
    }

    const confirmDeleteBooking = async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      })

      if (result.isConfirmed) {
        deleteBooking(id)
      }
    }

    const deleteBooking = async (id) => {
      try {
        await axios.delete(`${config.apiUrl}/bookings/delete/${id}`, {
          headers: config.getHeaders(),
        })
        fetchBookings() // Refresh the bookings list
        toast.success('The booking has been deleted.')
      } catch (error) {
        console.error('Error deleting booking:', error)
        toast.error('There was an error deleting the booking.')
      }
    }

    const viewBooking = (id) => {
      // Implement view booking logic
      this.$router.push(`/booking/view/${id}`)
    }

    const editBooking = (id) => {
      // Implement edit booking logic
      // For example, navigate to an edit booking page
      this.$router.push(`/booking/edit/${id}`)
    }

    const addFilters = (table) => {
      // Adding status filter
      table.columns(10).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Status</option></select>',
        )
          .appendTo('.product_status')
          .on('change', function () {
            column.search($(this).val()).draw()
          })

        column
          .data()
          .unique()
          .sort()
          .each(function (d) {
            select.append(`<option value="${d}">${d}</option>`)
          })
      })

      // Adding location filter
      table.columns(6).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Location</option></select>',
        )
          .appendTo('.product_location')
          .on('change', function () {
            column.search($(this).val()).draw()
          })

        column
          .data()
          .unique()
          .sort()
          .each(function (d) {
            if (d) {
              select.append(`<option value="${d}">${d}</option>`)
            }
          })
      })
    }

    return {
      bookings,
      initializeDataTable,
    }
  },
}
</script>

<template>
  <div>
    <FilterComponent @filter="initializeDataTable" />
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
          <th>Actions</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<style>
/* Add any required DataTable styles here */
table.table.dataTable span.badge {
  text-transform: capitalize;
  width: 90px;
}

.selected {
  background-color: rgba(var(--bs-primary-rgb), 0.08) !important;
}
</style>
