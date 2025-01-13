<script>
import axios from 'axios'
import { ref, onMounted, nextTick, watch, onBeforeUnmount } from 'vue' // Add nextTick and onBeforeUnmount
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
    const isMounted = ref(false)
    const abortController = ref(new AbortController())

    const API_URLs = {
      countries: 'https://restcountries.com/v3.1/all',
      states: 'https://countriesnow.space/api/v0.1/countries/states',
      cities: 'https://countriesnow.space/api/v0.1/countries/state/cities/q', // Updated endpoint
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
    onMounted(async () => {
      isMounted.value = true
      addressData.value = { ...props.modelValue }
      await loadCountries()
    })

    const loadCountries = async () => {
      if (!isMounted.value) return

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

          await nextTick() // Wait for DOM update
          await initializeSelect2('country-select')
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      }
    }

    const loadProvinces = async () => {
      if (!isMounted.value) return

      addressData.value.province = ''
      addressData.value.city = ''
      addressData.value.zip_code = ''
      locationData.value.provinces = []
      locationData.value.cities = []

      if (!addressData.value.country) return

      try {
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(API_URLs.states, {
          country: selectedCountry.name, // Use common name instead of official name
        })

        if (response.data?.data?.states) {
          locationData.value.provinces = response.data.data.states
            .map((state) => ({
              id: state.name, // Use name as id
              name: state.name,
              state_code: state.state_code,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        // Update select2
        const $select = $('#province-select')
        $select.empty().trigger('change')

        // Add default option
        $select.append(new Option('Select Province', '', true, true))

        // Add province options
        locationData.value.provinces.forEach((province) => {
          $select.append(new Option(province.name, province.name))
        })

        initializeSelect2('province-select')
      } catch (error) {
        console.error('Failed to load provinces:', error)
      }
    }

    const loadCities = async () => {
      if (!isMounted.value) return

      try {
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry || !addressData.value.province) {
          locationData.value.cities = []
          return
        }

        // Updated request payload
        const payload = {
          country: selectedCountry.name,
          state: addressData.value.province,
        }

        console.log('Fetching cities with payload:', payload)

        const response = await axios.post(API_URLs.cities, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        console.log('Cities API response:', response.data)

        if (response.data?.data && isMounted.value) {
          locationData.value.cities = response.data.data
            .filter((city) => city && typeof city === 'string')
            .map((city) => ({
              id: city,
              name: city,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

          await nextTick()

          // Update city select with new data
          const $citySelect = $('#city-select')
          if (!$citySelect.length) return

          $citySelect.empty()
          $citySelect.append(new Option('Select City', '', true, true))

          locationData.value.cities.forEach((city) => {
            $citySelect.append(new Option(city.name, city.name))
          })

          // Enable and initialize select2
          $citySelect.prop('disabled', false).trigger('change')
          await initializeSelect2('city-select')
        }
      } catch (error) {
        console.error('Failed to load cities:', error.response || error)
        locationData.value.cities = []
      }
    }

    const updateZipCode = () => {
      addressData.value.zip_code = ''
    }

    const initializeSelect2 = async (selectId) => {
      if (!isMounted.value) return

      await nextTick() // Wait for DOM update

      const $select = $(`#${selectId}`)
      if (!$select.length) return // Guard against element not found

      // Destroy existing select2 if it exists
      if ($select.hasClass('select2-hidden-accessible')) {
        $select.select2('destroy')
      }

      const config = {
        placeholder: `Select ${selectId.split('-')[0].charAt(0).toUpperCase() + selectId.split('-')[0].slice(1)}`,
        allowClear: true,
        width: '100%',
        disabled: selectId === 'city-select' ? !addressData.value.province : false,
      }

      if (selectId === 'country-select') {
        config.templateResult = (country) => {
          if (!country.id || !country.element) return country.text
          const flagUrl = country.element.dataset.flag
          return $(
            `<span><img src="${flagUrl}" class="flag-icon" onerror="this.style.display='none'"/> ${country.text}</span>`,
          )
        }
        config.templateSelection = config.templateResult
      }

      try {
        $select
          .select2(config)
          .on('select2:select', async (e) => {
            if (!isMounted.value) return
            const value = e.target.value
            addressData.value[selectId.split('-')[0]] = value

            if (selectId === 'country-select') {
              await loadProvinces()
              // Disable and clear city select
              $('#city-select').prop('disabled', true).val('').trigger('change')
            }

            if (selectId === 'province-select') {
              addressData.value.province = value
              console.log('Province selected:', value)
              await loadCities()
            }

            if (selectId === 'city-select') {
              addressData.value.city = value
              updateZipCode()
            }
          })
          .on('select2:clear', async () => {
            if (!isMounted.value) return
            addressData.value[selectId.split('-')[0]] = ''
            if (selectId === 'country-select') {
              await loadProvinces()
              $('#city-select').prop('disabled', true).val('').trigger('change')
            }
            if (selectId === 'province-select') {
              $('#city-select').prop('disabled', true).val('').trigger('change')
              locationData.value.cities = []
            }
          })
      } catch (error) {
        console.error(`Failed to initialize select2 for ${selectId}`, error)
      }
    }

    // Cleanup select2 instances
    onBeforeUnmount(() => {
      isMounted.value = false
      abortController.value
        .abort()

        [
          // Cleanup select2 instances
          ('country-select', 'province-select', 'city-select')
        ].forEach((selectId) => {
          const $select = $(`#${selectId}`)
          if ($select.length && $select.hasClass('select2-hidden-accessible')) {
            try {
              $select.select2('destroy')
            } catch (error) {
              console.warn(`Failed to destroy select2 for ${selectId}`, error)
            }
          }
        })
    })

    return {
      locationData,
      addressData,
      loadCountries,
      loadProvinces,
      loadCities,
      updateZipCode,
    }
  },
}
</script>

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
        <option v-for="city in locationData.cities" :key="city.id" :value="city.name">
          {{ city.name }}
        </option>
      </select>
    </div>

    <div class="col-md-6 mb-4">
      <label class="form-label">ZIP Code</label>
      <input v-model="addressData.zip_code" type="text" class="form-control" />
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

<style scoped>
.select2-container {
  width: 100% !important;
}
</style>
