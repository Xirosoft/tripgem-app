<script>
import $ from 'jquery'
export default {
  name: 'TourFilter',
  methods: {
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

      // Adding sort filter
      var sortSelect = $(
        '<select class="form-select text-capitalize"><option value="">Sort By</option><option value="priceLowToHigh">Price Low to High</option><option value="priceHighToLow">Price High to Low</option><option value="recommended">Recommended</option><option value="availableSeat">Available Seat</option></select>',
      )
        .appendTo('.sort_by')
        .on('change', function () {
          var sortBy = $(this).val()
          switch (sortBy) {
            case 'priceLowToHigh':
              table.order([4, 'asc']).draw()
              break
            case 'priceHighToLow':
              table.order([4, 'desc']).draw()
              break
            case 'recommended':
              // Add custom sorting logic for recommended
              break
            case 'availableSeat':
              table.order([7, 'desc']).draw()
              break
            default:
              table.order([]).draw()
              break
          }
        })
    },
  },
}
</script>

<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-3 tour_type"></div>
    <div class="col-md-3 transport_types"></div>
    <div class="col-md-3 status"></div>
    <div class="col-md-3 sort_by"></div>
  </div>
</template>

<style scoped></style>
