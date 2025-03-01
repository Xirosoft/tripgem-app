<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'
import 'jquery-ui/themes/base/all.css'
import 'jquery-ui/ui/widgets/datepicker'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default {
  name: 'FilterComponent',
  data() {
    return {
      startDate: null,
      endDate: null,
      presetDateRange: '',
    }
  },
  mounted() {
    this.initializeDatePickers()
  },
  methods: {
    initializeDatePickers() {
      const self = this
      $(this.$refs.startDate).datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect(dateText) {
          self.startDate = dateText
          self.onDateRangeChange()
        },
      })
      $(this.$refs.endDate).datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect(dateText) {
          self.endDate = dateText
          self.onDateRangeChange()
        },
      })
    },
    onDateRangeChange() {
      console.log('Custom date range changed:', this.startDate, this.endDate)
      this.filterByDateRange()
    },
    onPresetDateRangeChange() {
      console.log('Preset date range changed:', this.presetDateRange)
      const today = dayjs()
      let startDate, endDate

      switch (this.presetDateRange) {
        case 'today':
          startDate = today.startOf('day').format('YYYY-MM-DD')
          endDate = today.endOf('day').format('YYYY-MM-DD')
          break
        case 'yesterday':
          startDate = today.subtract(1, 'day').startOf('day').format('YYYY-MM-DD')
          endDate = today.subtract(1, 'day').endOf('day').format('YYYY-MM-DD')
          break
        case 'lastWeek':
          startDate = today.subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
          endDate = today.subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
          break
        case 'lastMonth':
          startDate = today.subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
          endDate = today.subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
          break
        case 'thisMonth':
          startDate = today.startOf('month').format('YYYY-MM-DD')
          endDate = today.endOf('month').format('YYYY-MM-DD')
          break
        default:
          startDate = null
          endDate = null
      }

      this.startDate = startDate
      this.endDate = endDate
      console.log('Date range set to:', this.startDate, this.endDate)
      this.filterByDateRange()
    },
    filterByDateRange() {
      const table = $('#bookingsTable').DataTable()
      const startDate = this.startDate ? dayjs(this.startDate) : null
      const endDate = this.endDate ? dayjs(this.endDate) : null

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
      <input type="text" ref="startDate" class="form-control" placeholder="Start Date" />
      <input type="text" ref="endDate" class="form-control mt-2" placeholder="End Date" />
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
