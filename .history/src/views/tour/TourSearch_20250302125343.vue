<script>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTourSearchStore } from '../../stores/tour/TourSearch.js'

export default {
  name: 'TourSearch',
  setup() {
    const tourSearchStore = useTourSearchStore()
    const router = useRouter()

    const searchText = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const adult = ref(1)
    const child = ref(0)
    const infant = ref(0)
    const location = ref('')
    const boatType = ref('')
    const tourType = ref('')
    const sortBy = ref('')
    const loading = ref(false)
    const error = ref(null)
    const tours = reactive([])

    const searchTours = async () => {
      const searchParams = {
        search_text: searchText.value,
        start_date: startDate.value,
        end_date: endDate.value,
        adult: adult.value,
        child: child.value,
        infant: infant.value,
        location: location.value,
        boat_type: boatType.value,
        tour_type: tourType.value,
        sort_by: sortBy.value,
      }
      loading.value = true
      error.value = null
      try {
        const fetchedTours = await tourSearchStore.fetchTours(searchParams)
        tours.splice(0, tours.length, ...fetchedTours)
      } catch (err) {
        error.value = 'Failed to fetch tours'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      loading.value = true
      error.value = null
      try {
        const fetchedTours = await tourSearchStore.fetchTours({})
        tours.splice(0, tours.length, ...fetchedTours)
      } catch (err) {
        error.value = 'Failed to fetch tours'
        console.error(err)
      } finally {
        loading.value = false
      }
    })

    const parseAvailableDates = (dates) => {
      try {
        const parsedDates = JSON.parse(dates)
        return parsedDates.map((dateRange) => `${dateRange.from} to ${dateRange.to}`).join(', ')
      } catch (error) {
        console.error('Error parsing available dates:', error)
        return 'Invalid dates'
      }
    }

    return {
      searchText,
      startDate,
      endDate,
      adult,
      child,
      infant,
      location,
      boatType,
      tourType,
      sortBy,
      searchTours,
      tours,
      loading,
      error,
      parseAvailableDates,
    }
  },
}
</script>

<template>
  <div class="row">
    <div class="col-md-3">
      <div class="mb-3">
        <label class="form-label" for="boatType">Boat Type</label>
        <input type="text" class="form-control" id="boatType" v-model="boatType" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="tourType">Tour Type</label>
        <input type="text" class="form-control" id="tourType" v-model="tourType" />
      </div>
      <div class="mb-3">
        <label class="form-label" for="sortBy">Sort By</label>
        <select class="form-select" id="sortBy" v-model="sortBy">
          <option value="">Select</option>
          <option value="recommended">Recommended</option>
          <option value="matched">Matched</option>
          <option value="low_to_high">Low to High</option>
          <option value="high_to_low">High to Low</option>
          <option value="top_reviewed">Top Reviewed</option>
        </select>
      </div>
    </div>
    <div class="col-md-6">
      <div v-if="loading">Loading tours...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="tours.length">
        <div class="demo-inline-spacing mt-4">
          <div class="list-group">
            <div
              v-for="tour in tours"
              :key="tour.id"
              class="list-group-item list-group-item-action d-flex align-items-center cursor-pointer waves-effect"
            >
              <img
                :src="tour.thumbnail"
                alt="Tour Thumbnail"
                class="rounded me-3"
                width="150"
                v-if="tour.thumbnail"
              />
              <div class="w-100">
                <div class="d-flex justify-content-between">
                  <div class="user-info">
                    <h6 class="mb-1 fw-normal">{{ tour.tour_name }}</h6>
                    <small class="text-muted">{{ tour.description }}</small>
                    <div class="user-status">
                      <span class="badge badge-dot bg-success"></span>
                      <small
                        >Available Dates: {{ parseAvailableDates(tour.available_dates) }}</small
                      >
                    </div>
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small>Adult Price: ฿{{ tour.net_price_adult }}</small>
                    </div>
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small>Child Price: ฿{{ tour.net_price_child }}</small>
                    </div>
                  </div>
                  <div class="add-btn">
                    <button
                      class="btn btn-primary btn-sm waves-effect waves-light"
                      @click="$emit('add-booking')"
                    >
                      Book Now
                    </button>
                    <button class="btn btn-sm btn-danger waves-effect waves-light">
                      View Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No tours available.</p>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Search Tours</h5>
          <small class="text-muted float-end">Filter options</small>
        </div>
        <div class="card-body">
          <form @submit.prevent="searchTours">
            <div class="mb-3">
              <label class="form-label" for="searchText">Search Text</label>
              <input type="text" class="form-control" id="searchText" v-model="searchText" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="startDate">Start Date</label>
              <input type="date" class="form-control" id="startDate" v-model="startDate" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="endDate">End Date</label>
              <input type="date" class="form-control" id="endDate" v-model="endDate" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="adult">Adults</label>
              <input type="number" class="form-control" id="adult" v-model="adult" min="1" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="child">Children</label>
              <input type="number" class="form-control" id="child" v-model="child" min="0" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="infant">Infants</label>
              <input type="number" class="form-control" id="infant" v-model="infant" min="0" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="location">Location</label>
              <input type="text" class="form-control" id="location" v-model="location" />
            </div>

            <button type="submit" class="btn btn-primary">Search</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Add your styles here */
</style>
