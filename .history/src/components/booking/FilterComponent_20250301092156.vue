<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-2 product_status"></div>
    <div class="col-md-2 product_location"></div>
    <div class="col-md-2 product_payment_method"></div>
    <div class="col-md-4 product_date_range"></div>
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

<script>
import 'daterangepicker'
import 'daterangepicker/daterangepicker.css'
import $ from 'jquery'
import moment from 'moment'

export default {
  name: 'FilterComponent',
  computed: {
    vCan() {
      const result = this.uCan('create', 'merchant_module')
      return result
    },
  },
  methods: {
    addFilters(table) {
      // Adding status filter
      table.columns(-2).every(function () {
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

      // Adding payment method filter
      table.columns(11).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Payment Method</option></select>',
        )
          .appendTo('.product_payment_method')
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

      // Adding date range filter
      const dateRangePicker = $(
        '<input type="text" class="form-control" placeholder="Select Date Range">',
      )
        .appendTo('.product_date_range')
        .daterangepicker(
          {
            opens: 'left',
            autoUpdateInput: false,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month'),
              ],
            },
          },
          function (start, end) {
            dateRangePicker.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'))
            column
              .search(start.format('YYYY-MM-DD') + '|' + end.format('YYYY-MM-DD'), true, false)
              .draw()
          },
        )

      dateRangePicker.on('cancel.daterangepicker', function () {
        $(this).val('')
        column.search('').draw()
      })
    },
  },
}
</script>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
