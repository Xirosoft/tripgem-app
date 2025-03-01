<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'
import DatePicker from 'vue-datepicker-next'
import 'vue-datepicker-next/index.css'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default {
  name: 'FilterComponent',
  components: {
    DatePicker,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dateRange: null,
      presetDateRange: '',
      selectedPaymentMethod: '',
      paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer'], // Example payment methods
    }
  },
  computed: {
    vCan() {
      const result = this.uCan('create', 'merchant_module')
      return result
    },
  },
  methods: {
    addFilters() {
      if (!this.table) {
        console.log('Table is not initialized')
        return
      }

      console.log('Adding filters...')

      // Adding status filter
      this.table.columns(10).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Status</option></select>',
        )
          .appendTo('.product_status') // Ensure the class name matches the template
          .on('change', function () {
            column.search($(this).val()).draw()
          })

        console.log('Status filter added')

        console.log('Status filter added')

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

      // Adding location filter
      this.table.columns(6).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Location</option></select>',
        )
          .appendTo('.product_location') // Ensure the class name matches the template
          .on('change', function () {
            column.search($(this).val()).draw()
          })

        console.log('Location filter added')

        column
          .data()
          .unique()
          .sort()
          .each(function (d) {
            if (d) {
              console.log('Location:', d) // Log each location for debugging
              select.append(`<option value="${d}">${d}</option>`)
            }
          })
      })

      // Adding payment method filter
      this.table.columns(11).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Payment Method</option></select>',
        )
          .appendTo('.product_payment_method')
          .on('change', function () {
            column.search($(this).val()).draw()
          })

        console.log('Payment method filter added')

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
    },
    onPaymentMethodChange() {
      if (!this.table) return
      this.table.column(11).search(this.selectedPaymentMethod).draw() // Assuming the payment method column is at index 11
    },
    onDateRangeChange() {
      if (!this.table) return
      if (this.dateRange) {
        const [start, end] = this.dateRange
        this.table
          .column(7) // Assuming the date column is at index 7
          .search(
            dayjs(start).format('YYYY-MM-DD') + '|' + dayjs(end).format('YYYY-MM-DD'),
            true,
            false,
          )
          .draw()
      } else {
        this.table.column(7).search('').draw() // Assuming the date column is at index 7
      }
    },
    onPresetDateRangeChange() {
      if (!this.table) return
      let start, end
      switch (this.presetDateRange) {
        case 'today':
          start = end = dayjs()
          break
        case 'yesterday':
          start = end = dayjs().subtract(1, 'day')
          break
        case 'lastWeek':
          start = dayjs().subtract(1, 'week').startOf('week')
          end = dayjs().subtract(1, 'week').endOf('week')
          break
        case 'lastMonth':
          start = dayjs().subtract(1, 'month').startOf('month')
          end = dayjs().subtract(1, 'month').endOf('month')
          break
        case 'thisMonth':
          start = dayjs().startOf('month')
          end = dayjs().endOf('month')
          break
        default:
          start = end = null
      }
      if (start && end) {
        this.dateRange = [start, end]
        this.table
          .column(7) // Assuming the date column is at index 7
          .search(
            dayjs(start).format('YYYY-MM-DD') + '|' + dayjs(end).format('YYYY-MM-DD'),
            true,
            false,
          )
          .draw()
      } else {
        this.dateRange = null
        this.table.column(7).search('').draw() // Assuming the date column is at index 7
      }
    },
  },
}
</script>

<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-2 product_status"></div>
    <div class="col-md-2 product_location"></div>
    <div class="col-md-2 product_payment_method"></div>
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
