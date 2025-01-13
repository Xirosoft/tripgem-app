<template>
  <div class="row">
    <div class="col-md-6 mb-4">
      <label class="form-label">Country*</label>
      <select id="country-select" v-model="addressData.country" class="form-select" required>
        <option value="">Select Country</option>
        <option
          v-for="country in locationData.countries"
          :key="country.id"
          :value="country.id"
          :data-flag="country.flag"
        >
          {{ country.name }}
        </option>
      </select>
    </div>

    <div class="col-md-6 mb-4">
      <label class="form-label">Province*</label>
      <select
        id="province-select"
        v-model="addressData.province"
        class="form-select"
        required
        :disabled="!addressData.country"
      >
        <option value="">Select Province</option>
        <option v-for="province in locationData.provinces" :key="province.id" :value="province.id">
          {{ province.name }}
        </option>
      </select>
    </div>

    <div class="col-md-6 mb-4">
      <label class="form-label">City*</label>
      <select
        id="city-select"
        v-model="addressData.city"
        class="form-select"
        required
        :disabled="!addressData.province"
      >
        <option value="">Select City</option>
        <option v-for="city in locationData.cities" :key="city.id" :value="city.id">
          {{ city.name }}
        </option>
      </select>
    </div>

    <div class="col-md-6 mb-4">
      <label class="form-label">ZIP Code</label>
      <input v-model="addressData.zip_code" type="text" class="form-control" readonly />
    </div>

    <div class="col-md-12 mb-4">
      <label class="form-label">Detailed Address*</label>
      <input
        v-model="addressData.address_details"
        type="text"
        class="form-control"
        required
        placeholder="Street address, building name, etc."
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'AddressBlock',
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const API_URLs = {
      countries: 'https://restcountries.com/v3.1/all',
      states: 'https://countriesnow.space/api/v0.1/countries/states',
      cities: 'https://countriesnow.space/api/v0.1/countries/cities',
    }

    const locationData = ref({
      countries: [],
      provinces: [],
      cities: [],
    })

    const addressData = ref({
      country: '',
      province: '',
      city: '',
      zip_code: '',
      address_details: '',
    })

    // Watch for changes and emit updates
    watch(
      addressData.value,
      (newVal) => {
        emit('update:modelValue', newVal)
      },
      { deep: true },
    )

    // Initialize from props
    onMounted(() => {
      addressData.value = { ...props.modelValue }
      loadCountries()
      initializeLocationFields()
    })

    const loadCountries = async () => {
      try {
        const response = await axios.get(API_URLs.countries)
        if (response.data) {
          locationData.value.countries = response.data
            .map((country) => ({
              id: country.cca2,
              name: country.name.common,
              flag: `https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`,
              officialName: country.name.official,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      }
    }

    const loadProvinces = async () => {
      // ... existing loadProvinces code ...
    }

    const loadCities = async () => {
      // ... existing loadCities code ...
    }

    const updateZipCode = async () => {
      addressData.value.zip_code = ''
    }

    const initializeLocationFields = () => {
      // ... existing initializeLocationFields code ...
    }

    return {
      locationData,
      addressData,
      loadCountries,
      loadProvinces,
      loadCities,
      updateZipCode,
      initializeLocationFields,
    }
  },
}
</script>

<style scoped>
.select2-container {
  width: 100% !important;
}
</style>
