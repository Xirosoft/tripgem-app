<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import { useMerchantsStore } from '../../stores/users/UsersList.js'

export default {
  setup() {
    const merchantsStore = useMerchantsStore()
    merchantsStore.fetchMerchants()

    return {
      merchantsStore,
    }
  },
  mounted() {
    const dt_user_table = $('.datatables-users')
    if (dt_user_table.length) {
      dt_user_table.DataTable({
        data: this.merchantsStore.merchants,
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
            <th>Plan</th>
            <th>Billing</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
    <!-- Offcanvas to add new user -->
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasAddUser"
      aria-labelledby="offcanvasAddUserLabel"
    >
      <div class="offcanvas-header border-bottom">
        <h5 id="offcanvasAddUserLabel" class="offcanvas-title">Add User</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body mx-0 flex-grow-0 p-6 h-100">
        <form class="add-new-user pt-0" id="addNewUserForm" onsubmit="return false">
          <div class="mb-6">
            <label class="form-label" for="add-user-fullname">Full Name</label>
            <input
              type="text"
              class="form-control"
              id="add-user-fullname"
              placeholder="John Doe"
              name="userFullname"
              aria-label="John Doe"
            />
          </div>
          <div class="mb-6">
            <label class="form-label" for="add-user-email">Email</label>
            <input
              type="text"
              id="add-user-email"
              class="form-control"
              placeholder="john.doe@example.com"
              aria-label="john.doe@example.com"
              name="userEmail"
            />
          </div>
          <div class="mb-6">
            <label class="form-label" for="add-user-contact">Contact</label>
            <input
              type="text"
              id="add-user-contact"
              class="form-control phone-mask"
              placeholder="+1 (609) 988-44-11"
              aria-label="john.doe@example.com"
              name="userContact"
            />
          </div>
          <div class="mb-6">
            <label class="form-label" for="add-user-company">Company</label>
            <input
              type="text"
              id="add-user-company"
              class="form-control"
              placeholder="Web Developer"
              aria-label="jdoe1"
              name="companyName"
            />
          </div>
          <div class="mb-6">
            <label class="form-label" for="country">Country</label>
            <select id="country" class="select2 form-select">
              <option value="">Select</option>
              <option value="Australia">Australia</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Belarus">Belarus</option>
              <option value="Brazil">Brazil</option>
              <option value="Canada">Canada</option>
              <option value="China">China</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Japan">Japan</option>
              <option value="Korea">Korea, Republic of</option>
              <option value="Mexico">Mexico</option>
              <option value="Philippines">Philippines</option>
              <option value="Russia">Russian Federation</option>
              <option value="South Africa">South Africa</option>
              <option value="Thailand">Thailand</option>
              <option value="Turkey">Turkey</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="form-label" for="user-role">User Role</label>
            <select id="user-role" class="form-select">
              <option value="subscriber">Subscriber</option>
              <option value="editor">Editor</option>
              <option value="maintainer">Maintainer</option>
              <option value="author">Author</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="form-label" for="user-plan">Select Plan</label>
            <select id="user-plan" class="form-select">
              <option value="basic">Basic</option>
              <option value="enterprise">Enterprise</option>
              <option value="company">Company</option>
              <option value="team">Team</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary me-3 data-submit">Submit</button>
          <button type="reset" class="btn btn-label-danger" data-bs-dismiss="offcanvas">
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
