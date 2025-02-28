<script>
import TourFilter from '@/components/tour/TourFilter.vue'
import axios from 'axios'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.min.css'
import Swal from 'sweetalert2'
import config from '../../config/config'
import { useTourListStore } from '../../stores/tour/TourList.js'

export default {
  name: 'TourList',
  components: {
    TourFilter,
  },
  data() {
    return {
      table: null,
      tourListStore: null,
      isLoading: false,
    }
  },
  async created() {
    this.tourListStore = useTourListStore()
    await this.tourListStore.fetchTourList()
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
    initializeDataTable() {
      if (this.table) {
        this.table.destroy()
      }
      this.table = $(this.$refs.toursTable).DataTable({
        data: this.tourListStore.tourList,
        columns: [
          { data: 'tour_id' },
          { data: 'tour_name' },
          { data: 'tour_type' },
          { data: 'transport_types' },
          { data: 'regular_price_adult' },
          { data: 'net_price_adult' },
          {
            data: 'available_dates',
            render: function (data) {
              try {
                const dates = JSON.parse(data)
                // console.log('dates:', dates[0]['from'], dates[0]['to'])
                return dates[0]['from'], dates[0]['to'] || 'Date not available'
              } catch (e) {
                return 'No dates available'.e
              }
            },
          },
          { data: 'available_seat' },
          {
            data: 'status',
            render: function (data) {
              const statusClasses = {
                pending: 'bg-label-warning',
                draft: 'bg-label-secondary',
                published: 'bg-label-success',
                trust: 'bg-label-info',
              }
              return `<span class="badge ${statusClasses[data] || 'bg-label-primary'}">${data}</span>`
            },
          },
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function () {
              return `
                <div class="d-inline-block text-nowrap">
                  <button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light edit-tour"><i class="ti ti-edit ti-md"></i></button>
                  <button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></button>
                  <div class="dropdown-menu dropdown-menu-end m-0">
                    <a href="javascript:0;" class="dropdown-item">View</a>
                    <a href="javascript:0;" class="dropdown-item delete-tour">Delete</a>
                  </div>
                </div>
              `
            },
          },
        ],
        destroy: true,
        initComplete: () => {
          // this.addFilters(this.table)
        },
      })

      // Add edit button handler
      $(this.$refs.toursTable).on('click', '.edit-tour', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.tour_id) {
          this.$router.push(`/edit-tour/${data.tour_id}`)
        }
      })

      // Add delete button handler
      $(this.$refs.toursTable).on('click', '.delete-tour', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.tour_id) {
          this.confirmDeleteTour(data.tour_id)
        }
      })
    },
    async confirmDeleteTour(id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      })

      if (result.isConfirmed) {
        this.deleteTour(id)
      }
    },
    async deleteTour(id) {
      try {
        await axios.delete(`${config.apiUrl}/tour/delete/${id}`, {
          headers: config.getHeaders(),
        })
        await this.tourListStore.fetchTourList() // Refresh the tour list
        this.table.clear()
        this.table.rows.add(this.tourListStore.tourList)
        this.table.draw()
        Swal.fire('Deleted!', 'The tour has been deleted.', 'success')
      } catch (error) {
        console.error('Error deleting tour:', error)
        Swal.fire('Error!', 'There was an error deleting the tour.', 'error')
      }
    },
    applyFilters(filters) {
      if (!filters) {
        // this.tourListStore.applyFilters(filters)
      }
      // Add sorting logic here if needed
    },
    addFilters(table) {
      if (!table) return
      this.$refs.tourFilter.addFilters(table)
    },
  },
  watch: {
    'tourListStore.tourList': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            if (!this.table) {
              this.initializeDataTable()
            } else {
              this.table.clear()
              this.table.rows.add(newVal)
              this.table.draw()
              this.addFilters(this.table) // Ensure filters are added after data is drawn
            }
          })
        }
      },
      deep: true,
    },
  },
  unmounted() {
    if (this.table) {
      this.table.destroy()
    }
  },
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title">Filter</h5>
      <TourFilter ref="tourFilter" @apply-filters="applyFilters" />
    </div>
    <div class="card-datatable table-responsive">
      <table ref="toursTable" class="datatables-products table">
        <thead class="border-top">
          <tr>
            <th>ID</th>
            <th>Tour Name</th>
            <th>Tour Type</th>
            <th>Transport</th>
            <th>Regular (Adult)</th>
            <th>Net (Adult)</th>
            <th>Available Dates</th>
            <th>Available Seat</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
// Add any required DataTable styles here
</style>
