<script>
export default {
  name: 'TourFilter',
  data() {
    return {
      filters: {
        tourName: '',
        tourType: '',
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
      <input v-model="filters.tourType" type="text" placeholder="Tour Type" />
      <!-- ...other filter inputs... -->
      <button @click="applyFilters">Apply</button>
      <button @click="resetFilters">Reset</button>
    </div>
  </div>
</template>

<style scoped>
// Add any required styles here
</style>
