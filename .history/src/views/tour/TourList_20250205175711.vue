<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import { onMounted, watch } from 'vue'
import { useTourListStore } from '../../stores/tour/TourList.js'

export default {
  name: 'TourList',
  components: {},
  setup() {
    const tourListStore = useTourListStore()
    const tourList = tourListStore.tourList
    const fetchTourList = tourListStore.fetchTourList

    onMounted(async () => {
      await fetchTourList()
    })

    watch(tourList, (newTourList) => {
      if ($.fn.dataTable.isDataTable('.datatables-products')) {
        $('.datatables-products').DataTable().clear().rows.add(newTourList).draw()
      } else {
        initializeDataTable(newTourList)
      }
    })

    const initializeDataTable = (data) => {
      $(document).ready(function () {
        $('.datatables-products').DataTable({
          data: data,
          columns: [
            { data: 'tour_id' },
            { data: 'tour_name' },
            { data: 'tour_type' },
            { data: 'description' },
            { data: 'regular_price_adult' },
            { data: 'net_price_adult' },
            { data: 'available_dates' },
            { data: 'available_seat' },
            { data: 'status' },
            { data: 'actions', orderable: false, searchable: false },
          ],
          columnDefs: [
            {
              targets: -1,
              render: function (data, type, full, meta) {
                return (
                  '<div class="d-inline-block text-nowrap">' +
                  '<button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light"><i class="ti ti-edit ti-md"></i></button>' +
                  '<button class="btn btn-sm btn-icon btn-text-secondary rounded-pill waves-effect waves-light dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ti ti-dots-vertical ti-md"></i></button>' +
                  '<div class="dropdown-menu dropdown-menu-end m-0">' +
                  '<a href="javascript:0;" class="dropdown-item">View</a>' +
                  '<a href="javascript:0;" class="dropdown-item">Suspend</a>' +
                  '</div>' +
                  '</div>'
                )
              },
            },
          ],
        })
      })
    }

    return {
      tourList,
    }
  },
}
</script>

<template>
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
            <th>Tour ID</th>
            <th>Tour Name</th>
            <th>tour_type</th>
            <th>transport_types</th>
            <th>Regular Price (Adult)</th>
            <th>Net Price (Adult)</th>
            <th>Available Dates</th>
            <th>Available Seat</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style lang="scss"></style>
