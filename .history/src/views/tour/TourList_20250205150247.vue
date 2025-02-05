<script>
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
// import $ from 'jquery'
import { useTourListStore } from '../../stores/tour/TourList.js'

export default {
  name: 'TourList',
  components: {
  },
  setup() {
    const tourListStore = useTourListStore()
    const tourList = tourListStore.tourList
    const fetchTourList = tourListStore.fetchTourList

    fetchTourList()

    return {
      tourList,
    }
  },

}
</script>

<template>
 `<div class="card">
      <div class="card-header">
        <h4 class="card-title">Users List</h4>
      </div>
    </div>
</template>

<style lang="scss">

</style>
