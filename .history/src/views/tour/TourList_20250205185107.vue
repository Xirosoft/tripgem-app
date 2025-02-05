<script>
import TourFilter from '@/components/tour/TourFilter.vue'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.min.css'
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
        initComplete: () => {
          this.addFilters(this.table)
        },
      })
    },
    applyFilters(filters) {
      this.tourListStore.applyFilters(filters)
      // Add sorting logic here if needed
    },
    addFilters(table) {
      // Adding tour type filter
      table.columns(2).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Tour Type</option></select>',
        )
          .appendTo('.tour_type')
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

      // Adding transport types filter
      table.columns(3).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Transport Types</option></select>',
        )
          .appendTo('.transport_types')
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

      // Adding status filter
      table.columns(8).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Status</option></select>',
        )
          .appendTo('.status')
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
      <TourFilter
        ref="TourFilter"
        @apply-filters="applyFilters"
        @add-tour="$router.push('/tour/add')"
      />
    </div>
    <div class="row pb-2 gap-3 gap-md-0">
      <div class="col-md-3 tour_type"></div>
      <div class="col-md-3 transport_types"></div>
      <div class="col-md-3 status"></div>
      <div class="col-md-3 d-flex align-items-center justify-content-md-end">
        <button class="dt-button add-new btn btn-primary" @click="$router.push('/tour/add')">
          <span>
            <i class="ti ti-plus me-0 me-sm-1 ti-xs"></i>
            <span class="d-none d-sm-inline-block">Add Tour</span>
          </span>
        </button>
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
