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

<template></template>

<style scoped></style>
