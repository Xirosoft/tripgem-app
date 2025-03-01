<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'
import 'vue-datepicker-next/index.css'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default {
  name: 'FilterComponent',
  data() {
    return {
      dateRange: null,
      presetDateRange: '',
    }
  },
  methods: {
    onDateRangeChange() {
      // Handle date range change
    },
    onPresetDateRangeChange() {
      // Handle preset date range change
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
  mounted() {},
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
      <button class="dt-button add-new btn btn-primary" v-if="vCan" @click="$emit('add-booking')">
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
