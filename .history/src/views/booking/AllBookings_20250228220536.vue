<script>
import FilterComponent from '@/components/booking/FilterComponent.vue'
import axios from 'axios'
import 'datatables.net-bs5'
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
import { useViewBookingsStore } from '../../stores/booking/viewBookingsStore'
</script>

<template>
  <div>
    <h1>All Bookings</h1>
  </div>
</template>

<style></style>
