<script>
import merchantsList from '../stores/MerchantsList'
import $ from 'jquery'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'

export default {
  name: 'MerchantsList',
  data() {
    return {
      table: null,
    }
  },
  mounted() {
    this.table = $(this.$refs.merchantsTable).DataTable({
      data: merchantsList,
      columns: [
        { data: '', defaultContent: '' }, // checkbox column
        { data: '', defaultContent: '' }, // image column
        { data: 'product' },
        { data: 'category' },
        { data: 'stock' },
        { data: 'sku' },
        { data: 'price' },
        { data: 'qty' },
        { data: 'status' },
        {
          data: null,
          defaultContent:
            '<div class="d-inline-block"><a href="javascript:;" class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical"></i></a></div>',
        },
      ],
      order: [[2, 'desc']],
      dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
    })
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
            <th></th>
            <th>product</th>
            <th>category</th>
            <th>stock</th>
            <th>sku</th>
            <th>price</th>
            <th>qty</th>
            <th>status</th>
            <th>actions</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
// Add any required DataTable styles here
</style>
