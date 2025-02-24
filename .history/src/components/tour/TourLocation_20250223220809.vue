<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../config/config'

const emit = defineEmits(['location-change'])
const locations = ref([])
const selectedLocation = ref(null)
const locationSelectRef = ref(null)
const showAddLocationForm = ref(false)
const loadingLocations = ref(false)

// Fetch existing locations from the API
const fetchLocations = async () => {
  loadingLocations.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/tour/locations/view`, {
      headers: config.getHeaders(),
    })
    locations.value = response.data
  } catch (error) {
    console.error('Error fetching locations:', error)
  } finally {
    loadingLocations.value = false
  }
}

// Add a new location to the API
const addLocation = async (location) => {
  try {
    const response = await axios.post(`${config.apiUrl}/tour/location/add`, location, {
      headers: config.getHeaders(),
    })
    console.log('Location added:', response.data)
    await fetchLocations()
  } catch (error) {
    console.error('Error adding location:', error)
  }
}

// Initialize Select2 for location select
const initializeSelect2 = () => {
  if (!locationSelectRef.value) return

  if ($.fn.select2 && $(locationSelectRef.value).data('select2')) {
    $(locationSelectRef.value).select2('destroy') // Destroy previous instance if exists
  }

  nextTick(() => {
    $(locationSelectRef.value)
      .select2({
        data: locations.value.map((location) => ({
          id: location.location_id.toString(),
          text: location.location_name,
        })),
      })
      .val(selectedLocation.value)
      .trigger('change')

      // Handle selecting location
      .on('select2:select', (e) => {
        const data = e.params.data
        selectedLocation.value = data.id
        emitLocationChange()
      })
  })
}

const emitLocationChange = () => {
  const selectedLocationData = locations.value.find(
    (location) => location.location_id.toString() === selectedLocation.value,
  )
  emit('location-change', selectedLocationData)
}

// Run on mount
onMounted(async () => {
  await fetchLocations()
  nextTick(() => {
    initializeSelect2()
  })
})

// Watch for changes in locations and reinitialize Select2
watch(locations, () => {
  nextTick(() => {
    initializeSelect2()
  })
})

// Watch for changes in selectedLocation and update Select2 UI
watch(selectedLocation, () => {
  $(locationSelectRef.value).val(selectedLocation.value).trigger('change')
})
</script>

<template>
  <div class="mb-6 col ecommerce-select2-dropdown">
    <label class="form-label mb-1" for="collection">Location</label>
    <select
      id="collection"
      class="select2 form-select"
      data-placeholder="Location"
      ref="locationSelectRef"
    >
      <option value="">Select Location</option>
      <option
        v-for="location in locations"
        :key="location.location_id"
        :value="location.location_id"
      >
        {{ location.location_name }}
      </option>
    </select>
  </div>
  <!-- Toggle Add Location Form -->
  <div class="mb-6 col">
    <a
      @click="showAddLocationForm = !showAddLocationForm"
      href="javascript:void(0)"
      class="btn-link"
    >
      {{ showAddLocationForm ? 'Hide Add Location Form' : 'Add New Location' }}
    </a>
  </div>
  <!-- Add Location Form -->
  <div v-if="showAddLocationForm" class="mb-6 col">
    <label class="form-label mb-1" for="new-location">Add New Location</label>
    <input
      id="new-location"
      v-model="newLocationName"
      class="form-control"
      placeholder="Location Name"
    />
    <input
      id="new-location-slug"
      v-model="newLocationSlug"
      class="form-control mt-2"
      placeholder="Location Slug"
    />
    <input
      id="new-location-address"
      v-model="newLocationAddress"
      class="form-control mt-2"
      placeholder="Formatted Address"
    />
    <select
      id="parent-location"
      v-model="selectedParentLocation"
      class="form-select mt-2"
      data-placeholder="Select Parent Location"
    >
      <option value="">Select Parent Location</option>
      <option
        v-for="location in locations"
        :key="location.location_id"
        :value="location.location_id"
      >
        {{ location.location_name }}
      </option>
    </select>
    <button
      @click="
        addLocation({
          location_name: newLocationName,
          location_slug: newLocationSlug,
          formatted_address: newLocationAddress,
          parent_id: selectedParentLocation,
        })
      "
      class="btn btn-primary mt-2"
    >
      Add Location
    </button>
  </div>
</template>

<style>
@import 'select2/dist/css/select2.css';

body .select2-container .select2-selection--single {
  height: auto;
}
body .select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
