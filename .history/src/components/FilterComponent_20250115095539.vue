<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-3 product_status"></div>
    <div class="col-md-3 product_category"></div>
    <div class="col-md-3 product_location"></div>
    <div class="col-md-3 d-flex align-items-center justify-content-md-end">
      <button class="dt-button add-new btn btn-primary" @click="$emit('add-merchant')">
        <span>
          <i class="ti ti-plus me-0 me-sm-1 ti-xs"></i>
          <span class="d-none d-sm-inline-block">Add Merchant</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterComponent',
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

      // Adding business type filter
      table.columns(4).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Business Type</option></select>',
        )
          .appendTo('.product_category')
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
      table.columns(5).every(function () {
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
    },
  },
}
</script>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
