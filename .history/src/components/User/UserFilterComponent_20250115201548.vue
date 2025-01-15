<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-3 user_status"></div>
    <div class="col-md-3 user_role"></div>
    <div class="col-md-3 user_verified"></div>
    <div class="col-md-3 d-flex align-items-center justify-content-md-end">
      <button
        class="dt-button add-new btn btn-primary"
        tabindex="0"
        aria-controls="DataTables_Table_0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasAddUser"
      >
        <span>
          <i class="ti ti-plus me-0 me-sm-1 ti-xs"></i>
          <span class="d-none d-sm-inline-block">Add User</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'UserFilterComponent',
  methods: {
    addFilters(table) {
      // Adding status filter
      table.columns(6).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Status</option></select>',
        )
          .appendTo('.user_status')
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

      // Adding role filter
      table.columns(3).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Role</option></select>',
        )
          .appendTo('.user_role')
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

      // Adding email filter
      table.columns(4).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Email</option></select>',
        )
          .appendTo('.user_email')
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

      // Adding verified filter
      table.columns(7).every(function () {
        var column = this
        var select = $(
          '<select class="form-select text-capitalize"><option value="">Verified</option></select>',
        )
          .appendTo('.user_verified')
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

<style scoped>
/* Add any specific styles for the filter component here */
</style>
