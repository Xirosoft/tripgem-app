<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import UserFilterComponent from '../../components/User/UserFilterComponent.vue'
import { useUsersListStore } from '../../stores/users/UsersList.js'

export default {
  name: 'UsersList',
  components: {
    UserFilterComponent,
  },
  data() {
    return {
      table: null,
      usersListStore: null,
      statusObj: {
        pending: { title: 'Pending', class: 'bg-label-warning' },
        approved: { title: 'Active', class: 'bg-label-success' },
        inactive: { title: 'Inactive', class: 'bg-label-danger' },
      },
    }
  },
  async created() {
    this.usersListStore = useUsersListStore()
    await this.usersListStore.fetchUsers()
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeDataTable()
    })
  },
  beforeUnmount() {
    if (this.table) {
      this.table.destroy()
    }
  },
  methods: {
    initializeDataTable() {
      if (this.table) {
        this.table.destroy()
      }
      this.table = $(this.$refs.usersTable).DataTable({
        data: this.usersListStore.getAllUsers,
        columns: [
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function () {
              return '<input type="checkbox" class="dt-checkboxes form-check-input">'
            },
            className: 'dt-checkboxes-cell',
          },
          { data: 'user_id' },
          {
            data: 'first_name',
            render: function (data, type, full) {
              return `${full.first_name} ${full.last_name}`
            },
          },
          { data: 'role_id' },
          { data: 'email' },
          { data: 'phone_number' },
          {
            data: 'status',
            render: function (data) {
              const statusClasses = {
                pending: 'bg-label-info',
                approved: 'bg-label-success',
                warning: 'bg-label-warning',
                suspend: 'bg-label-danger',
                hold: 'bg-label-dark',
                inactive: 'bg-label-danger',
              }
              return `<span class="badge ${statusClasses[data] || 'bg-label-primary'}">${data}</span>`
            },
          },
          {
            data: 'verified',
            render: function (data) {
              return data ? 'Yes' : 'No'
            },
          },
          {
            data: null,
            defaultContent: `
              <div class="d-inline-block">
                <a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="ti ti-dots-vertical"></i>
                </a>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="javascript:void(0);"><i class="ti ti-pencil me-1"></i>Edit</a>
                  <a class="dropdown-item" href="javascript:void(0);"><i class="ti ti-eye me-1"></i>View</a>
                  <a class="dropdown-item text-danger" href="javascript:void(0);"><i class="ti ti-trash me-1"></i>Delete</a>
                </div>
              </div>
            `,
          },
        ],
        order: [[2, 'desc']],
        dom:
          '<"card-header d-flex border-top rounded-0 flex-wrap py-0 flex-column flex-md-row align-items-start"' +
          '<"me-5 ms-n4 pe-5 mb-n6 mb-md-0"f>' +
          '<"d-flex justify-content-start justify-content-md-end align-items-baseline"<"dt-action-buttons d-flex flex-column align-items-start align-items-sm-center justify-content-sm-center pt-0 gap-sm-4 gap-sm-0 flex-sm-row"lB>>' +
          '>t' +
          '<"row"' +
          '<"col-sm-12 col-md-6"i>' +
          '<"col-sm-12 col-md-6"p>' +
          '>',
        buttons: [
          {
            extend: 'collection',
            className: 'btn btn-label-secondary dropdown-toggle me-4',
            text: '<i class="ti ti-upload me-1 ti-xs"></i>Export',
            buttons: [
              {
                extend: 'print',
                text: '<i class="ti ti-printer me-2" ></i>Print',
                className: 'dropdown-item',
              },
              {
                extend: 'csv',
                text: '<i class="ti ti-file me-2" ></i>CSV',
                className: 'dropdown-item',
              },
              {
                extend: 'excel',
                text: '<i class="ti ti-file-export me-2"></i>Excel',
                className: 'dropdown-item',
              },
              {
                extend: 'pdf',
                text: '<i class="ti ti-file-text me-2"></i>PDF',
                className: 'dropdown-item',
              },
            ],
          },
          {
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add User</span>',
            className: 'add-new btn btn-primary ms-2 ms-sm-0',
            action: () => {
              this.$router.push('/users/add')
            },
          },
        ],
      })

      // Add select all checkbox handler
      $(this.$refs.usersTable).on('change', '.select-all', (e) => {
        const isChecked = e.target.checked
        $(this.$refs.usersTable).find('tbody input[type="checkbox"]').prop('checked', isChecked)
        if (isChecked) {
          $(this.$refs.usersTable).find('tbody tr').addClass('selected')
        } else {
          $(this.$refs.usersTable).find('tbody tr').removeClass('selected')
        }
      })

      // Update individual checkbox handler
      $(this.$refs.usersTable).on('change', 'tbody input[type="checkbox"]', function () {
        const $row = $(this).closest('tr')
        $row.toggleClass('selected')

        // Update select all checkbox state
        const totalCheckboxes = $(this).closest('table').find('tbody input[type="checkbox"]').length
        const selectedCheckboxes = $(this)
          .closest('table')
          .find('tbody input[type="checkbox"]:checked').length
        $('.select-all').prop('checked', totalCheckboxes === selectedCheckboxes)
      })

      // Add filters
      this.$refs.filterComponent.addFilters(this.table)
    },
  },
  watch: {
    'usersListStore.users': {
      immediate: true, // This ensures the watcher runs immediately
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            if (!this.table) {
              this.initializeDataTable()
            } else {
              this.table.clear()
              this.table.rows.add(newVal)
              this.table.draw()
              this.$refs.filterComponent.addFilters(this.table) // Ensure filters are added after data is loaded
            }
          })
        }
      },
      deep: true,
    },
  },
  unmounted() {
    // Destroy DataTable when component is unmounted
    if (this.table) {
      this.table.destroy()
    }
  },
}
</script>

<template>
  <!-- Users List Table -->
  <div class="card">
    <div class="card-header border-bottom">
      <h5 class="card-title mb-3">Search Filter</h5>
      <UserFilterComponent ref="filterComponent" @add-user="$router.push('/users/add')" />
    </div>
    <div class="card-datatable table-responsive">
      <table ref="usersTable" class="datatables-users table">
        <thead class="border-top">
          <tr>
            <th><input type="checkbox" class="dt-checkboxes form-check-input select-all" /></th>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
// Add any required DataTable styles here
table.table.dataTable span.badge {
  text-transform: capitalize;
  width: 90px;
}

.selected {
  background-color: rgba(var(--bs-primary-rgb), 0.08) !important;
}
</style>
