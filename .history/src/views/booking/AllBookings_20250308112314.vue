<script>
import FilterComponent from '@/components/booking/FilterComponent.vue'
import axios from 'axios'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
import { useViewBookingsStore } from '../../stores/booking/AllBookings.js'

export default {
  name: 'AllBookings',
  components: {
    FilterComponent,
  },
  data() {
    return {
      table: null,
      bookingStore: null,
      toast: useToast(),
      filtersAdded: false,
    }
  },
  async created() {
    this.bookingStore = useViewBookingsStore()
    await this.bookingStore.fetchBookings()
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeDataTable()
    })
  },
  beforeUnmount() {
    if (this.table) {
      this.table.destroy()
    }
  },
  methods: {
    async confirmDeleteBooking(id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      })

      if (result.isConfirmed) {
        this.deleteBooking(id)
      }
    },
    async deleteBooking(id) {
      try {
        await axios.delete(`${config.apiUrl}/booking/delete/${id}`, {
          headers: config.getHeaders(),
        })
        this.bookingStore.fetchBookings() // Refresh the bookings list
        this.toast.success('The booking has been deleted.')
      } catch (error) {
        console.error('Error deleting booking:', error)
        this.toast.error('There was an error deleting the booking.')
      }
    },
    editBooking(id) {
      this.$router.push(`/booking/edit/${id}`)
    },
    viewBooking(id) {
      this.$router.push({
        name: 'ViewBooking',
        params: { id },
      })
    },
    initializeDataTable() {
      if (this.table) {
        this.table.destroy()
      }
      this.table = $(this.$refs.bookingsTable).DataTable({
        data: this.bookingStore.bookings,
        columns: [
          { data: 'invoice_id' },
          { data: 'full_name' },
          { data: 'contact_number' },
          { data: 'hotel_name' },
          { data: 'email' },
          {
            data: 'booking_date',
            render: function (data) {
              return data.split(' ')[0] // Show only the date part
            },
          },
          { data: 'travel_date' },
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
              this.$router.push('/bookings/add')
            },
          },
        ],
      })

      // Add delete button handler
      $(this.$refs.bookingsTable).on('click', '.delete-booking', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          this.confirmDeleteBooking(data.booking_id)
        }
      })

      // Add edit button handler
      $(this.$refs.bookingsTable).on('click', '.edit-booking', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          this.editBooking(data.booking_id)
        }
      })

      // Add view button handler
      $(this.$refs.bookingsTable).on('click', '.view-booking', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.booking_id) {
          this.viewBooking(data.booking_id)
        }
      })

      // Add filters if not already added
      if (!this.filtersAdded) {
        // this.$refs.filterComponent.addFilters(this.table)
        // this.filtersAdded = true
      }
    },
  },
  watch: {
    'bookingStore.bookings': {
      immediate: true, // This ensures the watcher runs immediately
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            if (!this.table) {
              this.initializeDataTable()
            } else {
              this.table.clear()
              this.table.rows.add(newVal)
              this.table.draw()
              this.$refs.filterComponent.addFilters(this.table)
            }
          })
        }
      },
      deep: true,
    },
  },
  unmounted() {
    // Destroy DataTable when component is unmounted
    if (this.table) {
      this.table.destroy()
    }
  },
}
</script>

<template>
  <div>
    <FilterComponent ref="filterComponent" :table="table" @filter="initializeDataTable" />
    <div class="table-responsive">
      <table ref="bookingsTable" class="table table-striped" id="bookingsTable">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Full Name</th>
            <th>Contact Number</th>
            <th>Hotel Name</th>
            <th>Email</th>
            <th>Booking Date</th>
            <th>Travel Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
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

.table-responsive {
  overflow-x: auto;
}
</style>
