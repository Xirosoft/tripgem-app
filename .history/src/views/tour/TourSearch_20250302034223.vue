<script>
import { onMounted, ref, watch } from 'vue'
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
      await tourSearchStore.fetchTours(searchParams)
    }

    onMounted(async () => {
      await tourSearchStore.fetchTours({})
    })

    watch(
      () => tourSearchStore.tours,
      (newTours) => {
        console.log('Tours updated:', newTours)
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
          tours: tourSearchStore.tours,
        }
      },
    )
  },
}
</script>

<template>
  <div>
    <h1>Tour Search</h1>
    <form @submit.prevent="searchTours">
      <input v-model="searchText" placeholder="Search Text" />
      <input v-model="startDate" type="date" placeholder="Start Date" />
      <input v-model="endDate" type="date" placeholder="End Date" />
      <input v-model="adult" type="number" min="1" placeholder="Adults" />
      <input v-model="child" type="number" min="0" placeholder="Children" />
      <input v-model="infant" type="number" min="0" placeholder="Infants" />
      <input v-model="location" placeholder="Location" />
      <input v-model="boatType" placeholder="Boat Type" />
      <input v-model="tourType" placeholder="Tour Type" />
      <select v-model="sortBy">
        <option value="">Sort By</option>
        <option value="recommended">Recommended</option>
        <option value="matched">Matched</option>
        <option value="low_to_high">Low to High</option>
        <option value="high_to_low">High to Low</option>
        <option value="top_reviewed">Top Reviewed</option>
      </select>
      <button type="submit">Search</button>
    </form>

    <div v-if="tours.length">
      <h2>Search Results</h2>
      <ul>
        <li v-for="tour in tours" :key="tour.id">
          <h3>{{ tour.tour_name }}</h3>
          <p>{{ tour.description }}</p>
          <p>Available Dates: {{ tour.available_dates }}</p>
          <p>Location: {{ tour.location }}</p>
          <p>Boat Type: {{ tour.boat_type }}</p>
          <p>Tour Type: {{ tour.tour_type }}</p>
          <p>Price: ${{ tour.regular_price_adult }}</p>
          <p>Rating: {{ tour.review_rating }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No tours available.</p>
    </div>
  </div>
</template>

<style>
/* Add your styles here */
</style>
