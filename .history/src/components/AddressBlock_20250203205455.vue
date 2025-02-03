<script>
import axios from 'axios'
import jQuery from 'jquery'
import select2 from 'select2'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const $ = jQuery
window.$ = window.jQuery = jQuery
select2()

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
      cities: 'https://countriesnow.space/api/v0.1/countries/state/cities',
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

    const isLoadingStates = ref(false)
    const isLoadingCities = ref(false)

    // Watch for changes and emit updates
    watch(
      addressData,
      (newVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(props.modelValue)) {
          emit('update:modelValue', newVal)
        }
      },
      { deep: true },
    )

    // Initialize from props
    onMounted(async () => {
      isMounted.value = true
      addressData.value = { ...props.modelValue }

      console.log('AddressBlock mounted:', addressData.value)

      await loadCountries()
      await nextTick()
      await initializeSelect2('country-select')
      await loadProvinces(true)
      await nextTick()
      await initializeSelect2('province-select')
      await loadCities(true)
      await nextTick()
      await initializeSelect2('city-select')
    })

    // Watch for changes in props.modelValue and update addressData
    watch(
      () => props.modelValue,
      (newVal) => {
        if (isMounted.value && JSON.stringify(newVal) !== JSON.stringify(addressData.value)) {
          addressData.value = { ...newVal }
          console.log('AddressBlock updated from props:', addressData.value)
        }
      },
      { deep: true, immediate: true },
    )

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

          await nextTick()
          await initializeSelect2('country-select')
        }
      } catch (error) {
        console.error('Failed to load countries:', error)
      }
    }

    const loadProvinces = async (initialLoad = false) => {
      if (!isMounted.value) return

      if (!initialLoad) {
        addressData.value.province = ''
        addressData.value.city = ''
        addressData.value.zip_code = ''
      }
      locationData.value.provinces = []
      locationData.value.cities = []

      if (!addressData.value.country) return

      try {
        isLoadingStates.value = true
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(API_URLs.states, {
          country: selectedCountry.name,
        })

        if (response.data?.data?.states) {
          locationData.value.provinces = response.data.data.states
            .map((state) => ({
              id: state.name,
              name: state.name,
              state_code: state.state_code,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

          await nextTick()

          const $select = $('#province-select')
          $select.empty()
          $select.append(new Option('Select Province', '', true, true))

          locationData.value.provinces.forEach((province) => {
            $select.append(new Option(province.name, province.name))
          })

          await initializeSelect2('province-select')

          if (initialLoad) {
            $select.val(addressData.value.province).trigger('change')
          }
        }
      } catch (error) {
        console.error('Failed to load provinces:', error)
      } finally {
        isLoadingStates.value = false
      }
    }

    const loadCities = async (initialLoad = false) => {
      if (!isMounted.value) return

      try {
        isLoadingCities.value = true
        const selectedCountry = locationData.value.countries.find(
          (c) => c.id === addressData.value.country,
        )
        if (!selectedCountry || !addressData.value.province) {
          locationData.value.cities = []
          return
        }

        const payload = {
          country: selectedCountry.name,
          state: addressData.value.province,
        }

        const response = await axios.post(API_URLs.cities, payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })

        if (response.data?.data && isMounted.value) {
          locationData.value.cities = response.data.data
            .filter((city) => city && typeof city === 'string')
            .map((city) => ({
              id: city,
              name: city,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))

          await nextTick()

          const $citySelect = $('#city-select')
          if (!$citySelect.length) return

          $citySelect.empty()
          $citySelect.append(new Option('Select City', '', true, true))

          locationData.value.cities.forEach((city) => {
            $citySelect.append(new Option(city.name, city.name))
          })

          $citySelect.prop('disabled', false).trigger('change')
          await initializeSelect2('city-select')

          if (initialLoad) {
            $citySelect.val(addressData.value.city).trigger('change')
          }
        }
      } catch (error) {
        console.error('Failed to load cities:', error.response || error)
        locationData.value.cities = []
      } finally {
        isLoadingCities.value = false
      }
    }

    const updateZipCode = () => {
      addressData.value.zip_code = ''
    }

    const initializeSelect2 = async (selectId) => {
      if (!isMounted.value) return

      await nextTick()

      const $select = $(`#${selectId}`)
      if (!$select.length) return

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
          .off('select2:select select2:clear')
          .on('select2:select', async (e) => {
            if (!isMounted.value) return
            const value = e.target.value

            if (selectId === 'country-select') {
              addressData.value.country = value
              await loadProvinces()
              $('#city-select').prop('disabled', true).val('').trigger('change')
            }

            if (selectId === 'province-select') {
              addressData.value.province = value
              await loadCities()
            }

            if (selectId === 'city-select') {
              addressData.value.city = value
              updateZipCode()
            }
          })
          .on('select2:clear', async () => {
            if (!isMounted.value) return

            if (selectId === 'country-select') {
              addressData.value.country = ''
              addressData.value.province = ''
              addressData.value.city = ''
              await loadProvinces()
            }

            if (selectId === 'province-select') {
              addressData.value.province = ''
              addressData.value.city = ''
              locationData.value.cities = []
              $('#city-select').prop('disabled', true).val('').trigger('change')
            }

            if (selectId === 'city-select') {
              addressData.value.city = ''
            }
          })

        $select.val(addressData.value[selectId.split('-')[0]]).trigger('change')
      } catch (error) {
        console.error(`Failed to initialize select2 for ${selectId}:`, error)
      }
    }

    onBeforeUnmount(() => {
      isMounted.value = false
      abortController.value
    })

    return {
      locationData,
      addressData,
      loadCountries,
      loadProvinces,
      loadCities,
      updateZipCode,
      isLoadingStates,
      isLoadingCities,
    }
  },
}
</script>

<template>
  <div class="row">
    <div class="col-md-6 mb-4">
      <label class="form-label">Country*</label>
      <select
        id="country-select"
        v-model="addressData.country"
        class="form-select select2"
        data-placeholder="Select Country"
        required
      >
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
      <div class="position-relative">
        <select
          id="province-select"
          v-model="addressData.province"
          class="form-select select2"
          data-placeholder="Select Province"
          required
          :disabled="!addressData.country"
        >
          <option value="">Select Province</option>
          <option
            v-for="province in locationData.provinces"
            :key="province.id"
            :value="province.name"
          >
            {{ province.name }}
          </option>
        </select>
        <div v-if="isLoadingStates" class="loader"></div>
      </div>
    </div>

    <div class="col-md-6 mb-4">
      <label class="form-label">City*</label>
      <div class="position-relative">
        <select
          id="city-select"
          v-model="addressData.city"
          class="form-select select2"
          data-placeholder="Select City"
          required
          :disabled="!addressData.province"
        >
          <option value="">Select City</option>
          <option v-for="city in locationData.cities" :key="city.id" :value="city.name">
            {{ city.name }}
          </option>
        </select>
        <div v-if="isLoadingCities" class="loader"></div>
      </div>
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

.loader {
  position: absolute;
  top: 10px;
  right: 15px;
  transform: translateY(-50%);
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
