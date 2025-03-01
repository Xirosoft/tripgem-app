<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-2 product_status"></div>
    <div class="col-md-2 product_location"></div>
    <div class="col-md-2 product_payment_method"></div>
    <div class="col-md-4 product_date_range">
      <DateRangePicker v-model="dateRange" @change="onDateRangeChange" />
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

<script>
import DateRangePicker from 'vue3-date-time-picker'
import 'vue3-date-time-picker/dist/main.css'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import $ from 'jquery'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export default {
  name: 'FilterComponent',
  components: {
    DateRangePicker,
  },
  data() {
    return {
      dateRange: null,
    }
  },
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
    },
    onDateRangeChange() {
      const table = this.$refs.table
      if (this.dateRange) {
        const [start, end] = this.dateRange
        table
          .column(7) // Assuming the date column is at index 7
          .search(
            dayjs(start).format('YYYY-MM-DD') + '|' + dayjs(end).format('YYYY-MM-DD'),
            true,
            false,
          )
          .draw()
      } else {
        table.column(7).search('').draw() // Assuming the date column is at index 7
      }
    },
  },
}
</script>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
