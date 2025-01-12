<script>
import { useMerchantsStore } from '../stores/MerchantsList.js'
import $ from 'jquery'
import 'datatables.net-bs5'
import DataTable from 'datatables.net-select-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

// ...existing code...
</script>

<template>
  <!-- Product List Widget -->

  <!-- Product List Table -->
  <div class="card">
    <div class="card-header border-bottom">
      <h5 class="card-title mb-3">Search Filter</h5>
      <div class="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
        <div class="col-md-4 product_status"></div>
        <div class="col-md-4 product_category"></div>
        <div class="col-md-4 d-flex align-items-center justify-content-md-end">
          <button class="dt-button add-new btn btn-primary" @click="$router.push('/merchants/add')">
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
table.table.dataTable span.badge {
  text-transform: capitalize;
  width: 90px;
}
.dt-checkboxes-cell {
  width: 40px;
  text-align: center;
}
.form-check-input {
  cursor: pointer;
}
</style>
