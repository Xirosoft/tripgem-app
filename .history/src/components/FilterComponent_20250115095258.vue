<template>
  <div>
    <label class="form-label">Business Type*</label>
    <select v-model="formData.business_type" class="form-select select2" required>
      <option value="">Select Type</option>
      <option v-for="type in businessTypes" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>

    <label class="form-label">Established Year</label>
    <select v-model="formData.established_year" class="form-select select2">
      <option value="">Select Year</option>
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>

    <label class="form-label">Select User*</label>
    <select v-model="formData.user_id" class="form-select select2" required>
      <option value="">Select User</option>
      <option v-for="user in users" :key="user.user_id" :value="user.user_id">
        {{ user.first_name }} {{ user.last_name }} ({{ user.email }})
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    formData: Object,
    businessTypes: Array,
    years: Array,
    users: Array,
  },
}
</script>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
