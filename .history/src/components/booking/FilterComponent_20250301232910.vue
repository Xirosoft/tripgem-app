<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'
import { ref, watch } from 'vue'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default {
  name: 'FilterComponent',
  components: {
    DatePicker,
  },
  setup() {
    const dateRange = ref([null, null])
    const presetDateRange = ref('')

    watch(dateRange, (newVal) => {
      console.log('Date range updated:', newVal)
    })

    return { dateRange, presetDateRange }
  },
  methods: {
    onDateRangeChange() {
      console.log('Custom date range changed:', this.dateRange)
      this.filterByDateRange()
    },
    onPresetDateRangeChange() {
      console.log('Preset date range changed:', this.presetDateRange)
      const today = dayjs()
      let startDate, endDate

      switch (this.presetDateRange) {
        case 'today':
          startDate = today.startOf('day')
          endDate = today.endOf('day')
          break
        case 'yesterday':
          startDate = today.subtract(1, 'day').startOf('day')
          endDate = today.subtract(1, 'day').endOf('day')
          break
        case 'lastWeek':
          startDate = today.subtract(1, 'week').startOf('week')
          endDate = today.subtract(1, 'week').endOf('week')
          break
        case 'lastMonth':
          startDate = today.subtract(1, 'month').startOf('month')
          endDate = today.subtract(1, 'month').endOf('month')
          break
        case 'thisMonth':
          startDate = today.startOf('month')
          endDate = today.endOf('month')
          break
        default:
          startDate = null
          endDate = null
      }

      this.dateRange = [startDate, endDate]
      console.log('Date range set to:', this.dateRange)
      this.filterByDateRange()
    },
    filterByDateRange() {
      const table = $('#bookingsTable').DataTable()
      const [startDate, endDate] = this.dateRange || []

      console.log('Filtering by date range:', startDate, endDate)

      $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(function (fn) {
        return fn.name !== 'dateRangeFilter'
      })

      if (startDate && endDate) {
        $.fn.dataTable.ext.search.push(function dateRangeFilter(settings, data) {
          const date = dayjs(data[7], 'YYYY-MM-DD') // Assuming booking date is in the 8th column
          console.log('Checking date:', date)
          return date.isBetween(startDate, endDate, null, '[]')
        })
      }
      table.draw()
    },
    addFilters(table) {
      // Adding status filter
      table.columns(10).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Status</option></select>',
        )
          .appendTo('.tour_status')
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
          .appendTo('.tour_location')
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

      // Adding payment method filter
      table.columns(9).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Payment Method</option></select>',
        )
          .appendTo('.tour_payment_method')
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
}
</script>

<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-2 tour_status"></div>
    <div class="col-md-2 tour_location"></div>
    <div class="col-md-2 tour_payment_method"></div>
    <div class="col-md-4 product_date_range">
      <DatePicker v-model="dateRange" range @change="onDateRangeChange" />
      <select class="form-select mt-2" v-model="presetDateRange" @change="onPresetDateRangeChange">
        <option value="">Select Date Range</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="thisMonth">This Month</option>
      </select>
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-md-end">
      <button class="dt-button add-new btn btn-primary" @click="$emit('add-booking')">
        <span>
          <i class="ti ti-plus me-0 me-sm-1 ti-xs"></i>
          <span class="d-none d-sm-inline-block">Add Booking</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
