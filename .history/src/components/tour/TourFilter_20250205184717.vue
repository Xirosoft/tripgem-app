<script>
export default {
  name: 'TourFilter',
  data() {
    return {
      filters: {
        tourName: '',
        tourType: '',
        transportTypes: '',
        status: '',
        sortBy: '',
        // ...other filters...
      },
    }
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', this.filters)
    },
    resetFilters() {
      this.filters = {
        tourName: '',
        tourType: '',
        transportTypes: '',
        status: '',
        sortBy: '',
        // ...reset other filters...
      }
      this.applyFilters()
    },
  },
}
</script>

<template>
  <div>
    <div class="filter-group">
      <input v-model="filters.tourName" type="text" placeholder="Tour Name" />
      <select v-model="filters.tourType">
        <option value="">Select Tour Type</option>
        <!-- Add options for tour types -->
      </select>
      <select v-model="filters.transportTypes">
        <option value="">Select Transport Types</option>
        <!-- Add options for transport types -->
      </select>
      <select v-model="filters.status">
        <option value="">Select Status</option>
        <!-- Add options for status -->
      </select>
      <select v-model="filters.sortBy">
        <option value="">Sort By</option>
        <option value="priceLowToHigh">Price Low to High</option>
        <option value="priceHighToLow">Price High to Low</option>
        <option value="recommended">Recommended</option>
        <option value="availableSeat">Available Seat</option>
      </select>
      <!-- ...other filter inputs... -->
      <button @click="applyFilters">Apply</button>
      <button @click="resetFilters">Reset</button>
    </div>
  </div>
</template>

<style scoped></style>
