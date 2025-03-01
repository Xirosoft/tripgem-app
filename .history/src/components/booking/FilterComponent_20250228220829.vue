<template>
  <div>
    <input v-model="searchQuery" placeholder="Search by name or location" />
    <button @click="applyFilter">Filter</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
    }
  },
  methods: {
    applyFilter() {
      this.$emit('filter', this.searchQuery)
    },
  },
}
</script>

<style scoped>
/* Add your styles here */
</style>
