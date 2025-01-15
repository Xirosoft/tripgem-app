<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import { useUsersStore } from '../../stores/users/UsersList.js'

export default {
  setup() {
    const usersStore = useUsersStore()
    usersStore.fetchUsers()

    return {
      usersStore,
    }
  },
  mounted() {
    const dt_user_table = $('.datatables-users')
    if (dt_user_table.length) {
      dt_user_table.DataTable({
        data: this.usersStore.users,
        columns: [
          { data: 'user_id' },
          { data: 'user_id' },
          { data: 'first_name' },
          { data: 'role_id' },
          { data: 'status' },
          { data: 'email' },
          { data: 'phone_number' },
          { data: 'action' },
        ],
        columnDefs: [
          {
            className: 'control',
            searchable: false,
            orderable: false,
            responsivePriority: 2,
            targets: 0,
            render: function () {
              return ''
            },
          },
          {
            targets: 1,
            orderable: false,
            checkboxes: {
              selectAllRender: '<input type="checkbox" class="form-check-input">',
            },
            render: function () {
              return '<input type="checkbox" class="dt-checkboxes form-check-input">'
            },
            searchable: false,
          },
          {
            targets: 2,
            responsivePriority: 4,
            render: function (data, type, full) {
              return `${full.first_name} ${full.last_name}`
            },
          },
          {
            targets: 3,
            render: function (data, type, full) {
              return full.role_id
            },
          },
          {
            targets: 4,
            render: function (data, type, full) {
              return full.status
            },
          },
          {
            targets: 5,
            render: function (data, type, full) {
              return full.email
            },
          },
          {
            targets: 6,
            render: function (data, type, full) {
              return full.phone_number
            },
          },
          {
            targets: -1,
            title: 'Actions',
            searchable: false,
            orderable: false,
            render: function () {
              return '<button class="btn btn-primary">Edit</button>'
            },
          },
        ],
        order: [[2, 'desc']],
        dom: '<"row"<"col-md-2"l><"col-md-10"fB>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        language: {
          sLengthMenu: '_MENU_',
          search: '',
          searchPlaceholder: 'Search User',
          paginate: {
            next: '<i class="ti ti-chevron-right ti-sm"></i>',
            previous: '<i class="ti ti-chevron-left ti-sm"></i>',
          },
        },
        buttons: [
          {
            extend: 'collection',
            className: 'btn btn-label-secondary dropdown-toggle mx-4 waves-effect waves-light',
            text: '<i class="ti ti-upload me-2 ti-xs"></i>Export',
            buttons: [
              {
                extend: 'print',
                text: '<i class="ti ti-printer me-2"></i>Print',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
              {
                extend: 'csv',
                text: '<i class="ti ti-file-text me-2"></i>Csv',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
              {
                extend: 'excel',
                text: '<i class="ti ti-file-spreadsheet me-2"></i>Excel',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
              {
                extend: 'pdf',
                text: '<i class="ti ti-file-code-2 me-2"></i>Pdf',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
              {
                extend: 'copy',
                text: '<i class="ti ti-copy me-2"></i>Copy',
                className: 'dropdown-item',
                exportOptions: {
                  columns: [1, 2, 3, 4, 5],
                },
              },
            ],
          },
          {
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New User</span>',
            className: 'add-new btn btn-primary waves-effect waves-light',
            attr: {
              'data-bs-toggle': 'offcanvas',
              'data-bs-target': '#offcanvasAddUser',
            },
          },
        ],
        responsive: {
          details: {
            display: $.fn.dataTable.Responsive.display.modal({
              header: function (row) {
                var data = row.data()
                return 'Details of ' + data.first_name + ' ' + data.last_name
              },
            }),
            type: 'column',
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col) {
                return col.title !== ''
                  ? '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '"><td>' +
                      col.title +
                      ':</td> <td>' +
                      col.data +
                      '</td></tr>'
                  : ''
              }).join('')

              return data ? $('<table class="table"/><tbody />').append(data) : false
            },
          },
        },
        initComplete: function () {
          this.api()
            .columns(3)
            .every(function () {
              var column = this
              var select = $(
                '<select id="UserRole" class="form-select text-capitalize"><option value=""> Select Role </option></select>',
              )
                .appendTo('.user_role')
                .on('change', function () {
                  var val = $.fn.dataTable.util.escapeRegex($(this).val())
                  column.search(val ? '^' + val + '$' : '', true, false).draw()
                })

              column
                .data()
                .unique()
                .sort()
                .each(function (d) {
                  select.append('<option value="' + d + '">' + d + '</option>')
                })
            })
          this.api()
            .columns(4)
            .every(function () {
              var column = this
              var select = $(
                '<select id="UserPlan" class="form-select text-capitalize"><option value=""> Select Plan </option></select>',
              )
                .appendTo('.user_plan')
                .on('change', function () {
                  var val = $.fn.dataTable.util.escapeRegex($(this).val())
                  column.search(val ? '^' + val + '$' : '', true, false).draw()
                })

              column
                .data()
                .unique()
                .sort()
                .each(function (d) {
                  select.append('<option value="' + d + '">' + d + '</option>')
                })
            })
          this.api()
            .columns(6)
            .every(function () {
              var column = this
              var select = $(
                '<select id="FilterTransaction" class="form-select text-capitalize"><option value=""> Select Status </option></select>',
              )
                .appendTo('.user_status')
                .on('change', function () {
                  var val = $.fn.dataTable.util.escapeRegex($(this).val())
                  column.search(val ? '^' + val + '$' : '', true, false).draw()
                })

              column
                .data()
                .unique()
                .sort()
                .each(function (d) {
                  select.append(
                    '<option value="' + d + '" class="text-capitalize">' + d + '</option>',
                  )
                })
            })
        },
      })
    }
  },
}
</script>

<template>
  <!-- Users List Table -->
  <div class="card">
    <div class="card-header border-bottom">
      <h5 class="card-title mb-0">Filters</h5>
      <div class="d-flex justify-content-between align-items-center row pt-4 gap-4 gap-md-0">
        <div class="col-md-4 user_role"></div>
        <div class="col-md-4 user_plan"></div>
        <div class="col-md-4 user_status"></div>
      </div>
    </div>
    <div class="card-datatable table-responsive">
      <table class="datatables-users table">
        <thead class="border-top">
          <tr>
            <th></th>
            <th></th>
            <th>User</th>
            <th>Role</th>
            <th>Phone</th>
            <!-- <th>Billing</th> -->
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
    <!-- Offcanvas to add new user -->
  </div>
</template>

<style lang="postcss" scoped></style>
