<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref } from 'vue'
import config from '../../../config/config'

const locations = ref([])
const selectedLocation = ref(null)
const selectedParentLocation = ref(null)
const locationSelectRef = ref(null)
const showAddLocationForm = ref(false)
const newLocationName = ref('')
const newLocationSlug = ref('')
const newLocationAddress = ref('')
const loadingLocations = ref(false)

const sortLocations = (locations) => {
  if (!locations) return []

  const sortedLocations = []
  const locationMap = new Map()

  locations.forEach((location) => {
    locationMap.set(location.location_id, { ...location, children: [] })
  })

  locationMap.forEach((location) => {
    if (location.parent_id) {
      locationMap.get(location.parent_id).children.push(location)
    } else {
      sortedLocations.push(location)
    }
  })

  const flattenLocations = (locations) => {
    return locations.reduce((acc, location) => {
      acc.push(location)
      if (location.children.length) {
        acc.push(...flattenLocations(location.children))
      }
      return acc
    }, [])
  }

  return flattenLocations(sortedLocations)
}

const fetchLocations = async () => {
  loadingLocations.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/tour/locations/view`, {
      headers: config.getHeaders(),
    })
    if (response.data && response.data) {
      locations.value = sortLocations(response.data)
    } else {
      console.error('Invalid response format:', response.data)
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  } finally {
    loadingLocations.value = false
  }
}

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

const getIndentedLocationName = (location) => {
  const indent = location.parent_id ? '\u00A0\u00A0\u00A0\u00A0' : ''
  return `${indent}${location.location_name}`
}

const initializeSelect2 = () => {
  if (!locationSelectRef.value) return
  nextTick(() => {
    $(locationSelectRef.value)
      .select2({
        data: locations.value.map((location) => ({
          id: location.location_id.toString(),
          text: location.location_name,
        })),
      })
      .trigger('change')
  })
}

onMounted(async () => {
  await fetchLocations()
  initializeSelect2()
  console.log(selectedLocation.value)

  $('#location')
    .val(
      locations.value.find((location) => location.location_name === selectedLocation.value)
        ?.location_id || '',
    )
    .trigger('change')
})
</script>

<template>
  <div>
    <!-- Collection -->
    <div class="mb-6 col ecommerce-select2-dropdown">
      <label class="form-label mb-1" for="collection">Location</label>
      <select
        id="location"
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
          {{ getIndentedLocationName(location) }}
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
          {{ getIndentedLocationName(location) }}
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
    <!-- Status -->
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
