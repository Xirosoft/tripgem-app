<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
// import $ from 'jquery'
// import { useTourListStore } from '../../stores/tour/TourList.js'

export default {
  name: 'TourList',
  components: {
  },


}
</script>

<template>
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
        <table class="datatables-products table">
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

</style>
