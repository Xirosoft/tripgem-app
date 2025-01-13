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

    async loadProvinces() {
      this.formData.province = ''
      this.formData.city = ''
      this.formData.zip_code = ''
      this.locationData.provinces = []

      if (!this.formData.country) return

      try {
        const selectedCountry = this.locationData.countries.find(
          (c) => c.id === this.formData.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(this.API_URLs.states, {
          country: selectedCountry.officialName,
        })

        if (response.data && response.data.data && response.data.data.states) {
          this.locationData.provinces = response.data.data.states
            .map((state) => ({
              id: state.state_code || state.name,
              name: state.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        this.$nextTick(() => {
          const $provinceSelect = $('#province-select')
          $provinceSelect.empty().trigger('change')

          // Add default option
          const $defaultOption = new Option('Select Province', '', true, true)
          $provinceSelect.append($defaultOption)

          // Add province options
          this.locationData.provinces.forEach((province) => {
            const $option = new Option(province.name, province.id, false, false)
            $provinceSelect.append($option)
          })

          $provinceSelect.trigger('change')
        })
      } catch (error) {
        console.error('Failed to load provinces:', error)
        this.toast.error('Failed to load provinces')
      }
    }

    async loadCities() {
      this.formData.city = ''
      this.formData.zip_code = ''
      this.locationData.cities = []

      if (!this.formData.province) return

      try {
        const selectedCountry = this.locationData.countries.find(
          (c) => c.id === this.formData.country,
        )
        if (!selectedCountry) return

        const response = await axios.post(this.API_URLs.cities, {
          country: selectedCountry.officialName,
        })

        if (response.data && response.data.data) {
          this.locationData.cities = response.data.data
            .map((city) => ({
              id: city,
              name: city,
              zip: '', // ZIP codes not provided by this API
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        this.$nextTick(() => {
          const $citySelect = $('#city-select')
          $citySelect.empty().trigger('change')

          // Add default option
          const $defaultOption = new Option('Select City', '', true, true)
          $citySelect.append($defaultOption)

          // Add city options
          this.locationData.cities.forEach((city) => {
            const $option = new Option(city.name, city.id, false, false)
            $citySelect.append($option)
          })

          $citySelect.trigger('change')
        })
      } catch (error) {
        console.error('Failed to load cities:', error)
        this.toast.error('Failed to load cities')
      }
    }

    async updateZipCode() {
      this.formData.zip_code = '' // Clear ZIP code as it's not provided by the API
    }

    initializeLocationFields() {
      this.$nextTick(() => {
        // Initialize country select with REST Countries data
        $('#country-select')
          .select2({
            placeholder: 'Select Country',
            allowClear: true,
            templateResult: (country) => {
              if (!country.id || !country.element) return country.text
              const flagUrl = country.element.dataset.flag
              const $country = $(
                `<span><img src="${flagUrl}" class="flag-icon" onerror="this.style.display='none'"/> ${country.text}</span>`,
              )
              return $country
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
            this.formData.country = e.target.value
            this.loadProvinces()
          })
          .on('select2:clear', () => {
            this.formData.country = ''
            this.loadProvinces()
          })

        // Initialize province select
        $('#province-select')
          .select2({
            placeholder: 'Select Province',
            allowClear: true,
          })
          .on('select2:select', (e) => {
            this.formData.province = e.target.value
            this.loadCities()
          })
          .on('select2:clear', () => {
            this.formData.province = ''
            this.loadCities()
          })

        // Initialize city select
        $('#city-select')
          .select2({
            placeholder: 'Select City',
            allowClear: true,
          })
          .on('select2:select', (e) => {
            this.formData.city = e.target.value
            this.updateZipCode()
          })
          .on('select2:clear', () => {
            this.formData.city = ''
            this.updateZipCode()
          })
      })
    },

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
