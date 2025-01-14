<script>
import { useMerchantsStore } from '../stores/merchant/MerchantsList.js'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

export default {
  name: 'MerchantsList',
  data() {
    return {
      table: null,
      merchantStore: null,
      statusObj: {
        pending: { title: 'Pending', class: 'bg-label-warning' },
        approved: { title: 'Active', class: 'bg-label-success' },
        inactive: { title: 'Inactive', class: 'bg-label-danger' },
      },
      businessTypes: {
        Tourism: { title: 'Tourism' },
        Travel: { title: 'Travel' },
        Hospitality: { title: 'Hospitality' },
      },
    }
  },
  async created() {
    this.merchantStore = useMerchantsStore()
    await this.merchantStore.fetchMerchants()
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeDataTable()
    })
  },

  methods: {
    initializeDataTable() {
      if (this.table) {
        this.table.destroy()
      }
      this.table = $(this.$refs.merchantsTable).DataTable({
        data: this.merchantStore.getAllMerchants,
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
          { data: 'id' },
          {
            data: 'logo_url',
            render: function (data) {
              return data ? `<img src="${data}" alt="logo" class="rounded" height="32">` : ''
            },
          },
          { data: 'company_name' },
          { data: 'business_type' },
          { data: 'headquarters_location' }, // Add location column
          { data: 'registration_number' },
          { data: 'phone_number' },
          { data: 'email_address' },
          {
            data: 'status',
            render: function (data) {
              const statusClasses = {
                pending: 'bg-label-warning',
                approved: 'bg-label-success',
                inactive: 'bg-label-danger',
              }
              return `<span class="badge ${statusClasses[data] || 'bg-label-primary'}">${data}</span>`
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
            text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add Merchant</span>',
            className: 'add-new btn btn-primary ms-2 ms-sm-0',
            action: () => {
              this.$router.push('/merchants/add')
            },
          },
        ],
        initComplete: function () {
          // Adding status filter
          this.api()
            .columns(-2)
            .every(function () {
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
          this.api()
            .columns(4)
            .every(function () {
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

          this.api()
            .columns(5) // Changed from 6 to 5 to match headquarters_location column position
            .every(function () {
              var column = this
              var select = $(
                '<select class="form-select text-capitalize"><option value="">Location</option></select>',
              )
                .appendTo('.product_location') // Changed from .location to .product_location
                .on('change', function () {
                  column.search($(this).val()).draw()
                })

              column
                .data()
                .unique()
                .sort()
                .each(function (d) {
                  if (d) {
                    // Only add non-null values
                    select.append(`<option value="${d}">${d}</option>`)
                  }
                })
            })
        },
      })

      // Add select all checkbox handler
      $(this.$refs.merchantsTable).on('change', '.select-all', (e) => {
        const isChecked = e.target.checked
        $(this.$refs.merchantsTable).find('tbody input[type="checkbox"]').prop('checked', isChecked)
        if (isChecked) {
          $(this.$refs.merchantsTable).find('tbody tr').addClass('selected')
        } else {
          $(this.$refs.merchantsTable).find('tbody tr').removeClass('selected')
        }
      })

      // Update individual checkbox handler
      $(this.$refs.merchantsTable).on('change', 'tbody input[type="checkbox"]', function () {
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
    'merchantStore.merchants': {
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
  <!-- Product List Widget -->

  <!-- Product List Table -->
  <div class="card">
    <div class="card-header border-bottom">
      <h5 class="card-title mb-3">Search Filter</h5>
      <div class="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
        <div class="col-md-3 product_status"></div>
        <div class="col-md-3 product_category"></div>
        <div class="col-md-3 product_location"></div>
        <div class="col-md-3 d-flex align-items-center justify-content-md-end">
          <button class="dt-button add-new btn btn-primary" @click="$router.push('/merchant/add')">
            <span
              ><i class="ti ti-plus me-0 me-sm-1 ti-xs"></i
              ><span class="d-none d-sm-inline-block">Add Merchant</span></span
            >
          </button>
        </div>
      </div>
    </div>
    <div class="card-datatable table-responsive">
      <table ref="merchantsTable" class="datatables-products table">
        <thead class="border-top">
          <tr>
            <th><input type="checkbox" class="dt-checkboxes form-check-input select-all" /></th>
            <th>ID</th>
            <th>Logo</th>
            <th>Company Name</th>
            <th>Business Type</th>
            <th>Location</th>
            <th>Registration No.</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
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
