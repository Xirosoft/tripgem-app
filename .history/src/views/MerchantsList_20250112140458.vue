<script>
import { useMerchantsStore } from '../stores/MerchantsList.js'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

export default {
  name: 'MerchantsList',
  data() {
    return {
      table: null,
      merchantStore: null,
    }
  },
  async created() {
    this.merchantStore = useMerchantsStore()
    await this.merchantStore.fetchMerchants()
  },
  mounted() {
    this.initializeDataTable()
    const script = document.createElement('script')
    script.src = '../../src/frontend/assets/js/app-ecommerce-product-list.js'
    script.async = true
    document.body.appendChild(script)
  },
  methods: {
    initializeDataTable() {
      this.table = $(this.$refs.merchantsTable).DataTable({
        data: this.merchantStore.getAllMerchants,
        columns: [
          { data: '', defaultContent: '' }, // checkbox column
          { data: 'id' },
          {
            data: 'logo_url',
            render: function (data) {
              return data ? `<img src="${data}" alt="logo" class="rounded" height="32">` : ''
            },
          },
          { data: 'company_name' },
          { data: 'business_type' },
          { data: 'registration_number' },
          { data: 'phone_number' },
          { data: 'email_address' },
          {
            data: 'status',
            render: function (data) {
              const statusClasses = {
                pending: 'bg-label-warning',
                active: 'bg-label-success',
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
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
      })
    },
  },
  watch: {
    'merchantStore.merchants': {
      handler(newVal) {
        if (this.table) {
          this.table.clear()
          this.table.rows.add(newVal)
          this.table.draw()
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
    <div class="card-header">
      <h5 class="card-title">Filter</h5>
      <div class="d-flex justify-content-between align-items-center row pt-4 gap-6 gap-md-0">
        <div class="col-md-4 product_status"></div>
        <div class="col-md-4 product_category"></div>
        <div class="col-md-4 product_stock"></div>
      </div>
    </div>
    <div class="card-datatable table-responsive">
      <table ref="merchantsTable" class="datatables-products table">
        <thead class="border-top">
          <tr>
            <th></th>
            <th>ID</th>
            <th>Logo</th>
            <th>Company Name</th>
            <th>Business Type</th>
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
</style>
