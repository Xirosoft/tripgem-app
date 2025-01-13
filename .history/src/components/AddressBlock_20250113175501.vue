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
import { ref, onMounted, watch } from 'vue' // Add watch import
import jQuery from 'jquery'
const $ = jQuery

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
      addressData,
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
      addressData.value.province = ''
      addressData.value.city = ''
      addressData.value.zip_code = ''
      locationData.value.provinces = []

      if (!addressData.value.country) return

      try {
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(API_URLs.states, {
          country: selectedCountry.officialName,
        })

        if (response.data?.data?.states) {
          locationData.value.provinces = response.data.data.states
            .map((state) => ({
              id: state.state_code || state.name,
              name: state.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        // Update select2 options
        updateSelect2Options('province-select', locationData.value.provinces)
      } catch (error) {
        console.error('Failed to load provinces:', error)
      }
    }

    const loadCities = async () => {
      addressData.value.city = ''
      addressData.value.zip_code = ''
      locationData.value.cities = []

      if (!addressData.value.province) return

      try {
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(API_URLs.cities, {
          country: selectedCountry.officialName,
        })

        if (response.data?.data) {
          locationData.value.cities = response.data.data
            .map((city) => ({
              id: city,
              name: city,
              zip: '', // ZIP codes not provided by this API
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        // Update select2 options
        updateSelect2Options('city-select', locationData.value.cities)
      } catch (error) {
        console.error('Failed to load cities:', error)
      }
    }

    const updateZipCode = () => {
      addressData.value.zip_code = ''
    }

    const updateSelect2Options = (selectId, options) => {
      const $select = $(`#${selectId}`)
      $select.empty()

      // Add default option
      $select.append(new Option('Select option', '', true, true))

      // Add new options
      options.forEach((option) => {
        $select.append(new Option(option.name, option.id, false, false))
      })

      $select.trigger('change')
    }

    const initializeLocationFields = () => {
      $('#country-select')
        .select2({
          placeholder: 'Select Country',
          allowClear: true,
          templateResult: (country) => {
            if (!country.id || !country.element) return country.text
            const flagUrl = country.element.dataset.flag
            return $(
              `<span><img src="${flagUrl}" class="flag-icon" onerror="this.style.display='none'"/> ${country.text}</span>`,
            )
          },
          templateSelection: (country) => {
            if (!country.id || !country.element) return country.text
            const flagUrl = country.element.dataset.flag
            return $(
              `<span><img src="${flagUrl}" class="flag-icon" onerror="this.style.display='none'"/> ${country.text}</span>`,
            )
          },
        })
        .on('select2:select', (e) => {
          addressData.value.country = e.target.value
          loadProvinces()
        })
        .on('select2:clear', () => {
          addressData.value.country = ''
          loadProvinces()
        })

      $('#province-select')
        .select2({
          placeholder: 'Select Province',
          allowClear: true,
        })
        .on('select2:select', (e) => {
          addressData.value.province = e.target.value
          loadCities()
        })
        .on('select2:clear', () => {
          addressData.value.province = ''
          loadCities()
        })

      $('#city-select')
        .select2({
          placeholder: 'Select City',
          allowClear: true,
        })
        .on('select2:select', (e) => {
          addressData.value.city = e.target.value
          updateZipCode()
        })
        .on('select2:clear', () => {
          addressData.value.city = ''
          updateZipCode()
        })
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
