<script>
import AddPermissionModal from '@/components/permission/AddPermissionModal.vue'
import EditPermissionModal from '@/components/permission/EditPermissionModal.vue'
import 'datatables.net-bs5'
import $ from 'jquery'
import { usePermissionStore } from '../../stores/permission/PermissionStore.js'

export default {
  name: 'PermissionsList',
  components: {
    AddPermissionModal,
    EditPermissionModal,
  },
  data() {
    return {
      table: null,
      permissionStore: null,
      isLoading: false,
    }
  },
  async created() {
    this.isLoading = true
    this.permissionStore = usePermissionStore()
    await this.permissionStore.fetchPermissions()
    this.isLoading = false
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
      this.table = $(this.$refs.permissionsTable).DataTable({
        data: this.permissionStore.permissions,
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
          { data: 'permission_id' }, // ID field
          {
            data: 'permission_name', // Name field
            render: function (data) {
              return data.replace(/_/g, ' ').replace(/\b\w/g, function (char) {
                return char.toUpperCase()
              })
            },
          },
          { data: 'slug' }, // Slug field
          { data: 'description' }, // Description field
          { data: 'created_at' }, // Created date field
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
        order: [[1, 'asc']],
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
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add Permission</span>',
            className: 'add-new btn btn-primary ms-2 ms-sm-0',
            action: () => {
              $('#addPermissionModal').modal('show')
            },
          },
        ],
      })

      // Add select all checkbox handler
      $(this.$refs.permissionsTable).on('change', '.select-all', (e) => {
        const isChecked = e.target.checked
        $(this.$refs.permissionsTable)
          .find('tbody input[type="checkbox"]')
          .prop('checked', isChecked)
        if (isChecked) {
          $(this.$refs.permissionsTable).find('tbody tr').addClass('selected')
        } else {
          $(this.$refs.permissionsTable).find('tbody tr').removeClass('selected')
        }
      })

      // Update individual checkbox handler
      $(this.$refs.permissionsTable).on('change', 'tbody input[type="checkbox"]', function () {
        const $row = $(this).closest('tr')
        $row.toggleClass('selected')

        // Update select all checkbox state
        const totalCheckboxes = $(this).closest('table').find('tbody input[type="checkbox"]').length
        const selectedCheckboxes = $(this)
          .closest('table')
          .find('tbody input[type="checkbox"]:checked').length
        $('.select-all').prop('checked', totalCheckboxes === selectedCheckboxes)
      })
    },
  },
  watch: {
    'permissionStore.permissions': {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            if (!this.table) {
              this.initializeDataTable()
            } else {
              this.table.clear()
              this.table.rows.add(newVal)
              this.table.draw()
            }
          })
        }
      },
      deep: true,
    },
  },
  unmounted() {
    if (this.table) {
      this.table.destroy()
    }
  },
}
</script>

<template>
  <!-- Permissions List Table -->
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0">Permissions</h5>
      <div class="dt-buttons btn-group flex-wrap">
        <button
          class="btn add-new btn-primary mb-6 mb-md-0 waves-effect waves-light"
          tabindex="0"
          aria-controls="DataTables_Table_0"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#addPermissionModal"
        >
          <span>
            <i class="ti ti-plus ti-xs me-0 me-sm-2"></i>
            <span class="d-none d-sm-inline-block">Add Permission</span>
          </span>
        </button>
      </div>
    </div>
    <div class="card-datatable table-responsive">
      
      <table ref="permissionsTable" class="datatables-permissions table">
        <thead class="border-top">
          <tr>
            <th><input type="checkbox" class="dt-checkboxes form-check-input select-all" /></th>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
    <AddPermissionModal />
    <EditPermissionModal />
  </div>
</template>

<style lang="scss">
table.table.dataTable span.badge {
  text-transform: capitalize;
  width: 90px;
}

.selected {
  background-color: rgba(var(--bs-primary-rgb), 0.08) !important;
}
</style>
