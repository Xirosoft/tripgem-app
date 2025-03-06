<script>
import { debounce } from 'lodash'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SearchCard from '../../components/preloader/SearchCard.vue'
import { useTourSearchStore } from '../../stores/tour/TourSearch.js'

export default {
  name: 'TourSearch',

  components: {
    SearchCard,
  },
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
    const filtering = ref(false)

    const searchTours = debounce(async () => {
      filtering.value = true
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
        filtering.value = false
      }
    }, 700)

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

    const validateRange = (type) => {
      if (type === 'min' && priceMin.value > priceMax.value) {
        priceMin.value = priceMax.value
      } else if (type === 'max' && priceMax.value < priceMin.value) {
        priceMax.value = priceMin.value
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
      validateRange,
      filtering,
      router,
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
        <label class="form-label" for="priceRange"><b>Price Range</b></label>
        <div class="multi-range">
          <input
            type="range"
            class="form-range range-min"
            v-model="priceMin"
            min="0"
            max="10000"
            @input="validateRange('min')"
            @change="searchTours"
          />
          <input
            type="range"
            class="form-range range-max"
            v-model="priceMax"
            min="0"
            max="10000"
            @input="validateRange('max')"
            @change="searchTours"
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
        <label class="form-label"><b>Languages Supported</b></label>
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
        <label class="form-label"><b>Pick Up Time</b></label>
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
        <label class="form-label"><b>Drop Off Time</b></label>
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
      <div v-if="loading"><SearchCard /></div>
      <div v-if="error">{{ error }}</div>
      <div v-if="tours.length">
        <div class="demo-inline-spacing mt-4">
          <div class="list-group">
            <div
              v-for="tour in paginatedTours"
              :key="tour.id"
              class="list-group-item list-group-item-action d-flex align-items-center cursor-pointer waves-effect pr-0 mb-4 bg-white"
            >
              <div class="row w-100 pt-2 pb-2">
                <div class="col-md-3">
                  <img
                    :src="tour.thumbnail"
                    alt="Tour Thumbnail"
                    class="rounded me-3 img-fluid"
                    v-if="tour.thumbnail"
                  />
                </div>
                <div class="col-md-7">
                  <div class="content-area justify-content-between">
                    <div class="heading">
                      <h6 class="mb-1 fw-normal">{{ tour.tour_name }}</h6>
                      <small class="text-muted"
                        >{{ tour.description?.split(' ').slice(0, 20).join(' ')
                        }}{{ tour.description?.split(' ').length > 20 ? '...' : '' }}</small
                      >
                    </div>
                    <ul class="p-0 m-0">
                      <li class="mb-2 d-flex justify-content-between align-items-center">
                        <div class="badge bg-label-success rounded p-1">
                          <i class="ti ti-circle-check"></i>
                        </div>
                        <div class="d-flex justify-content-between w-100 flex-wrap">
                          <h6 class="mb-0 ms-4">Details</h6>
                          <div class="d-flex">
                            <p class="mb-0">Net</p>
                            <p class="ms-4 text-success mb-0">Regular</p>
                          </div>
                        </div>
                      </li>
                      <li class="mb-2 d-flex justify-content-between align-items-center">
                        <div class="badge bg-label-success rounded p-1">
                          <i class="ti ti-mail ti-md"></i>
                        </div>
                        <div class="d-flex justify-content-between w-100 flex-wrap">
                          <h6 class="mb-0 ms-4">Emails</h6>
                          <div class="d-flex">
                            <p class="mb-0">12,346</p>
                            <p class="ms-4 text-success mb-0">0.3%</p>
                          </div>
                        </div>
                      </li>
                      <li class="mb-2 d-flex justify-content-between align-items-center">
                        <div class="badge bg-label-info rounded p-1_5">
                          <i class="ti ti-link ti-md"></i>
                        </div>
                        <div class="d-flex justify-content-between w-100 flex-wrap">
                          <h6 class="mb-0 ms-4">Opened</h6>
                          <div class="d-flex">
                            <p class="mb-0">8,734</p>
                            <p class="ms-4 text-success mb-0">2.1%</p>
                          </div>
                        </div>
                      </li>
                      <li class="mb-2 d-flex justify-content-between align-items-center">
                        <div class="badge bg-label-warning rounded p-1_5">
                          <i class="ti ti-mouse ti-md"></i>
                        </div>
                        <div class="d-flex justify-content-between w-100 flex-wrap">
                          <h6 class="mb-0 ms-4">Clicked</h6>
                          <div class="d-flex">
                            <p class="mb-0">967</p>
                            <p class="ms-4 text-danger mb-0">1.4%</p>
                          </div>
                        </div>
                      </li>

                    <div class="user-status">
                      <span class="badge badge-dot bg-success"></span>
                      <small>Available Seat: {{ tour.available_seat }}</small>
                    </div>
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small
                        >Adult Price: ฿{{
                          tour.net_price_adult + ' | ฿' + tour.regular_price_adult
                        }}</small
                      >
                    </div>
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small
                        >Child Price: ฿{{
                          tour.net_price_child + ' | ฿' + tour.regular_price_child
                        }}</small
                      >
                    </div>
                    <div class="user-status">
                      <span class="badge badge-dot bg-info"></span>
                      <small>Tour Operator: {{ tour.merchant_name }}</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="add-btn">
                    <button
                      class="btn btn-primary btn-sm waves-effect waves-light"
                      @click="router.push(`/add-booking/${tour.tour_id}`)"
                    >
                      <i class="ti ti-shopping-cart me-1"></i>
                      Book Now
                    </button>
                    <button
                      class="btn btn-sm btn-danger waves-effect waves-light mt-2"
                      @click="router.push(`/view-tour/${tour.tour_id}`)"
                    >
                      <i class="ti ti-eye me-1"></i>
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
                ><i class="ti ti-chevrons-left ti-sm"></i
              ></a>
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
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)"
                ><i class="ti ti-chevrons-right ti-sm"></i
              ></a>
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
              <label class="form-label" for="searchText">Destination</label>
              <input
                type="text"
                class="form-control"
                id="searchText"
                placeholder="Place, Activity, or Tour Name"
                v-model="searchText"
              />
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
  <div v-if="filtering" class="loading-overlay">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.list-group img {
  height: 170px;
  width: auto;
  object-fit: cover;
  min-width: 100%;
}
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
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.add-btn {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  height: 100%;
  align-content: center;
}
</style>
