<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import { useTourListStore } from '../../stores/tour/TourList.js'

export default {
  name: 'TourList',
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
          { data: 'available_dates' },
          { data: 'available_seat' },
          { data: 'status' },
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function () {
              return `
                <div class="d-inline-block text-nowrap">
                  <button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light"><i class="ti ti-edit ti-md"></i></button>
                  <button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></button>
                  <div class="dropdown-menu dropdown-menu-end m-0">
                    <a href="javascript:0;" class="dropdown-item">View</a>
                    <a href="javascript:0;" class="dropdown-item">Suspend</a>
                  </div>
                </div>
              `
            },
          },
        ],
      })
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
      <div class="d-flex justify-content-between align-items-center row pt-4 gap-6 gap-md-0">
        <div class="col-md-4 product_status"></div>
        <div class="col-md-4 product_category"></div>
        <div class="col-md-4 product_stock"></div>
      </div>
    </div>
    <div class="card-datatable table-responsive">
      <table ref="toursTable" class="datatables-products table">
        <thead class="border-top">
          <tr>
            <th>ID</th>
            <th>Tour Name</th>
            <th>Tour Type</th>
            <th>Transport Types</th>
            <th>Regular Price (Adult)</th>
            <th>Net Price (Adult)</th>
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
