<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
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
    const priceMin = ref(0)
    const priceMax = ref(10000)
    const transportTypes = ref([])
    const languagesSupported = ref([])
    const pickUpTime = ref([])
    const dropTime = ref([])
    const loading = ref(false)
    const error = ref(null)
    const tours = reactive([])
    const currentPage = ref(1)
    const itemsPerPage = ref(5)
    const travelersEnabled = ref(false)

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
        price_min: priceMin.value,
        price_max: priceMax.value,
        transport_types: transportTypes.value.join(','),
        languages_supported: languagesSupported.value.join(','),
        pick_up_time: pickUpTime.value.join(','),
        drop_time: dropTime.value.join(','),
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

    watch(
      [sortBy, priceMin, priceMax, transportTypes, languagesSupported, pickUpTime, dropTime],
      async () => {
        await searchTours()
      },
    )

    const parseAvailableDates = (dates) => {
      try {
        const parsedDates = JSON.parse(dates)
        return parsedDates.map((dateRange) => `${dateRange.from} to ${dateRange.to}`).join(', ')
      } catch (error) {
        console.error('Error parsing available dates:', error)
        return 'Invalid dates'
      }
    }

    const paginatedTours = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return tours.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(tours.length / itemsPerPage.value)
    })

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const travelersText = computed(() => {
      return `${adult.value} Adults, ${child.value} Children, ${infant.value} Infants`
    })

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
      priceMin,
      priceMax,
      transportTypes,
      languagesSupported,
      pickUpTime,
      dropTime,
      searchTours,
      tours,
      loading,
      error,
      parseAvailableDates,
      paginatedTours,
      currentPage,
      totalPages,
      changePage,
      travelersEnabled,
      travelersText,
    }
  },
}
</script>

<template>
  <div class="row">
    <div class="col-md-2 left-sidebar-filter">
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
      <div class="mb-3">
        <div
          id="slider-tap"
          class="mt-6 mb-12 noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr"
        >
          <div class="noUi-base">
            <div class="noUi-connects">
              <div
                class="noUi-connect"
                style="transform: translate(2.19496%, 0px) scale(0.363604, 1)"
              ></div>
            </div>
            <div class="noUi-origin" style="transform: translate(-97.805%, 0px); z-index: 5">
              <div
                class="noUi-handle noUi-handle-lower"
                data-handle="0"
                tabindex="0"
                role="slider"
                aria-orientation="horizontal"
                aria-valuemin="10.0"
                aria-valuemax="44.7"
                aria-valuenow="12.0"
                aria-valuetext="11.98"
              >
                <div class="noUi-touch-area"></div>
              </div>
            </div>
            <div class="noUi-origin" style="transform: translate(-61.4447%, 0px); z-index: 6">
              <div
                class="noUi-handle noUi-handle-upper"
                data-handle="1"
                tabindex="0"
                role="slider"
                aria-orientation="horizontal"
                aria-valuemin="12.0"
                aria-valuemax="100.0"
                aria-valuenow="44.7"
                aria-valuetext="44.70"
              >
                <div class="noUi-touch-area"></div>
              </div>
            </div>
          </div>
        </div>
        <label class="form-label" for="priceRange">Price Range</label>
        <div class="multi-range">
          <input
            type="range"
            class="form-range range-min"
            v-model="priceMin"
            min="0"
            max="10000"
            @input="validateRange('min')"
          />
          <input
            type="range"
            class="form-range range-max"
            v-model="priceMax"
            min="0"
            max="10000"
            @input="validateRange('max')"
          />
        </div>
        <div>Price: ฿{{ priceMin }} - ฿{{ priceMax }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label"><b>Transport Types</b></label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="transport1"
            value="Bus"
            v-model="transportTypes"
          />
          <label class="form-check-label" for="transport1">Bus</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="transport2"
            value="Boat"
            v-model="transportTypes"
          />
          <label class="form-check-label" for="transport2">Boat</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="transport3"
            value="Car"
            v-model="transportTypes"
          />
          <label class="form-check-label" for="transport3">Car</label>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Languages Supported</label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="language1"
            value="English"
            v-model="languagesSupported"
          />
          <label class="form-check-label" for="language1">English</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="language2"
            value="French"
            v-model="languagesSupported"
          />
          <label class="form-check-label" for="language2">French</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="language3"
            value="Spanish"
            v-model="languagesSupported"
          />
          <label class="form-check-label" for="language3">Spanish</label>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Pick Up Time</label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="pickup1"
            value="Morning"
            v-model="pickUpTime"
          />
          <label class="form-check-label" for="pickup1">Morning</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="pickup2"
            value="Afternoon"
            v-model="pickUpTime"
          />
          <label class="form-check-label" for="pickup2">Afternoon</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="pickup3"
            value="Evening"
            v-model="pickUpTime"
          />
          <label class="form-check-label" for="pickup3">Evening</label>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Drop Off Time</label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="drop1"
            value="Morning"
            v-model="dropTime"
          />
          <label class="form-check-label" for="drop1">Morning</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="drop2"
            value="Afternoon"
            v-model="dropTime"
          />
          <label class="form-check-label" for="drop2">Afternoon</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="drop3"
            value="Evening"
            v-model="dropTime"
          />
          <label class="form-check-label" for="drop3">Evening</label>
        </div>
      </div>
    </div>
    <div class="col-md-7">
      <div v-if="loading">Loading tours...</div>
      <div v-if="error">{{ error }}</div>
      <div v-if="tours.length">
        <div class="demo-inline-spacing mt-4">
          <div class="list-group">
            <div
              v-for="tour in paginatedTours"
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
                    <small class="text-muted"
                      >{{ tour.description?.split(' ').slice(0, 20).join(' ')
                      }}{{ tour.description?.split(' ').length > 20 ? '...' : '' }}</small
                    >
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
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small>Tour Operator: {{ tour.merchant_name }}</small>
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
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mt-4">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)"
                >Previous</a
              >
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
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
              <label class="form-label" for="travelers">Travelers</label>
              <input
                type="text"
                class="form-control"
                id="travelers"
                :value="travelersText"
                @click="travelersEnabled = !travelersEnabled"
                readonly
              />
            </div>
            <div v-if="travelersEnabled" class="traveller-options">
              <div class="mb-3">
                <label class="form-label" for="adult">Adults</label>
                <input
                  type="number"
                  class="form-control"
                  id="adult"
                  value="1"
                  v-model="adult"
                  min="1"
                />
              </div>
              <div class="mb-3">
                <label class="form-label" for="child">Children <small>below 10 years</small></label>
                <input type="number" class="form-control" id="child" v-model="child" min="0" />
              </div>
              <div class="mb-3">
                <label class="form-label" for="infant">Infants <small>Below 2 years</small></label>
                <input type="number" class="form-control" id="infant" v-model="infant" min="0" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label" for="location">Location</label>
              <input type="text" class="form-control" id="location" v-model="location" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="boatType">Boat Type</label>
              <input type="text" class="form-control" id="boatType" v-model="boatType" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="tourType">Tour Type</label>
              <input type="text" class="form-control" id="tourType" v-model="tourType" />
            </div>
            <button type="submit" class="btn btn-primary">Search</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.traveller-options {
  position: absolute;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e9f2;
  padding: 1rem;
  z-index: 1000;
  width: 90%;
}
.multi-range {
  position: relative;
  height: 30px;
}

.multi-range input[type='range'] {
  position: absolute;
  width: 100%;
  pointer-events: none;
}

.multi-range input[type='range']::-webkit-slider-thumb {
  pointer-events: auto;
}

.multi-range .range-min {
  z-index: 2;
}

.multi-range .range-max {
  z-index: 1;
}
</style>
