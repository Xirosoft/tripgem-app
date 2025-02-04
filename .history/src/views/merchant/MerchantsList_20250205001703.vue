<script>
import FilterComponent from '@/components/merchant/FilterComponent.vue'
import axios from 'axios'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
import { useMerchantsStore } from '../../stores/merchant/MerchantsList.js'

export default {
  name: 'MerchantsList',
  components: {
    FilterComponent,
  },
  computed: {
    vCan() {
      const result = this.uCan('create', 'merchant_module')
      return result
    },
  },
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
      toast: useToast(),
      filtersAdded: false,
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
  onBeforeUnmount() {
    if (this.table) {
      this.table.destroy()
    }
  },
  methods: {
    async confirmDeleteMerchant(id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      })

      if (result.isConfirmed) {
        this.deleteMerchant(id)
      }
    },
    async deleteMerchant(id) {
      try {
        await axios.delete(`${config.apiUrl}/merchant/delete/${id}`, {
          headers: config.getHeaders(),
        })
        this.merchantStore.fetchMerchants() // Refresh the merchant list
        this.toast.success('The merchant has been deleted.')
      } catch (error) {
        console.error('Error deleting merchant:', error)
        this.toast.error('There was an error deleting the merchant.')
      }
    },
    editMerchant(id) {
      this.$router.push(`/merchant/edit/${id}`)
    },
    viewMerchant(id) {
      this.$router.push({
        name: 'ViewMerchant',
        params: { id },
      })
    },
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
                  <a class="dropdown-item edit-merchant" href="javascript:void(0);"><i class="ti ti-pencil me-1"></i>Edit</a>
                  <a class="dropdown-item view-merchant" href="javascript:void(0);"><i class="ti ti-eye me-1"></i>View</a>
                  <a class="dropdown-item text-danger delete-merchant" href="javascript:void(0);"><i class="ti ti-trash me-1"></i>Delete</a>
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
      })

      // Add delete button handler
      $(this.$refs.merchantsTable).on('click', '.delete-merchant', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.id) {
          this.confirmDeleteMerchant(data.id)
        }
      })

      // Add edit button handler
      $(this.$refs.merchantsTable).on('click', '.edit-merchant', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.id) {
          this.editMerchant(data.id)
        }
      })

      // Add view button handler
      $(this.$refs.merchantsTable).on('click', '.view-merchant', (e) => {
        const data = this.table.row($(e.currentTarget).closest('tr')).data()
        if (data && data.id) {
          this.viewMerchant(data.id)
        }
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

      // Add filters if not already added
      if (!this.filtersAdded) {
        this.$refs.filterComponent.addFilters(this.table)
        this.filtersAdded = true
      }
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
              // this.$refs.filterComponent.addFilters(this.table) // Ensure filters are added after data is loaded
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
      <FilterComponent ref="filterComponent" @add-merchant="$router.push('/merchant/add')" />
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
