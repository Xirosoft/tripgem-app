<script>
import { useMerchantsStore } from '@/stores/merchant/AddMerchant'
import config from '../config/config'
import Quill from 'quill'
import Dropzone from 'dropzone'
import Tagify from '@yaireo/tagify'
import flatpickr from 'flatpickr'
import { useToast } from 'vue-toastification'
import { useUsersStore } from '@/stores/users'

import jQuery from 'jquery'
const $ = jQuery
window.$ = window.jQuery = jQuery
import select2 from 'select2'
select2() // Initialize select2

import 'jquery.repeater/jquery.repeater.min.js'
import 'jquery.repeater/jquery.repeater.js'
import 'quill/dist/quill.snow.css'
import 'dropzone/dist/dropzone.css'
import '@yaireo/tagify/dist/tagify.css'
import 'flatpickr/dist/flatpickr.css'
import 'select2/dist/css/select2.css'
import 'select2/dist/js/select2.full.js'

// Add typeahead import
import 'typeahead.js'

// Add axios import at the top
import axios from 'axios'

// Update the SAMPLE_DATA constant
// const SAMPLE_DATA = {
//   provinces: {
//     US: [
//       { id: 'FL', name: 'Florida' },
//     ],
//     GB: [
//       { id: 'ENG', name: 'England' },
//       { id: 'SCT', name: 'Scotland' },
//       { id: 'WLS', name: 'Wales' },
//     ],
//     // Add more as needed
//   },
//   cities: {
//     CA: [
//       { id: 'LA', name: 'Los Angeles', zip: '90001' },
//       { id: 'SF', name: 'San Francisco', zip: '94101' },
//       { id: 'SD', name: 'San Diego', zip: '92101' },
//     ],
//     NY: [
//       { id: 'NYC', name: 'New York City', zip: '10001' },
//       { id: 'BUF', name: 'Buffalo', zip: '14201' },
//       { id: 'ALB', name: 'Albany', zip: '12201' },
//     ],
//     // Add more as needed
//   },
// }

Dropzone.autoDiscover = false

export default {
  name: 'AddMerchants',
  setup() {
    const toast = useToast()
    const merchantStore = useMerchantsStore()
    const usersStore = useUsersStore()
    return { toast, merchantStore, usersStore }
  },
  data() {
    return {
      editor: null,
      dropzone: null,
      tagify: null,
      formData: {
        user_id: '', // Changed from 10 to empty string
        company_name: '',
        logo_url: '',
        slogan: '',
        registration_number: '',
        established_year: null,
        headquarters_location: '',
        branch_locations: [], // Keep as array
        business_type: '',
        address: '',
        phone_number: '',
        email_address: '',
        website: '',
        social_media_links: {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: '',
        },
        contact_person_name: '',
        position_designation: '',
        emergency_contact_number: '',
        tourism_license_number: '',
        tin: '',
        business_permits: [],
        membership_certificates: [],
        documents: [],
        country: '',
        province: '',
        city: '',
        address_details: '',
        zip_code: '',
      },
      businessTypes: [
        { value: 'Tourism', label: 'Tourism' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Taxi', label: 'Taxi' },
      ],
      years: Array.from(
        { length: new Date().getFullYear() - 1900 + 1 },
        (_, i) => 1900 + i,
      ).reverse(),
      uploadedLogo: null,
      uploadedFiles: {
        business_permits: [],
        membership_certificates: [],
        documents: [],
      },
      users: [],
      locationData: {
        countries: [], // Will be populated from REST Countries API
        provinces: [],
        cities: [],
        zipCodes: {},
      },
      OPENCAGE_API_KEY: '1e66ba3ae6cd48629e50f28f7107b184', // Replace with your actual API key
    }
  },
  async created() {
    try {
      await this.usersStore.fetchVerifiedUsers()
      this.users = this.usersStore.getVerifiedUsers
    } catch (error) {
      console.error('Failed to load users:', error)
      this.toast.error('Failed to load users list')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeComponents()
      this.loadCountries()
      this.initializeLocationFields()
    })
  },
  methods: {
    initializeComponents() {
      // Initialize Quill Editor
      const commentEditor = document.querySelector('.comment-editor')
      if (commentEditor) {
        this.editor = new Quill(commentEditor, {
          modules: {
            toolbar: '.comment-toolbar',
          },
          placeholder: 'Product Description',
          theme: 'snow',
        })
      }

      // Initialize Dropzone
      const previewTemplate = `<div class="dz-preview dz-file-preview">
        <div class="dz-details">
          <div class="dz-thumbnail">
            <img data-dz-thumbnail>
            <span class="dz-nopreview">No preview</span>
            <div class="dz-success-mark"></div>
            <div class="dz-error-mark"></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
            <div class="progress">
              <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
            </div>
          </div>
          <div class="dz-filename" data-dz-name></div>
          <div class="dz-size" data-dz-size></div>
        </div>
      </div>`

      const dropzoneBasic = document.querySelector('#dropzone-basic')
      if (dropzoneBasic) {
        this.dropzone = new Dropzone(dropzoneBasic, {
          url: `${config.apiUrl}/upload`,
          headers: config.getHeaders(),
          previewTemplate,
          parallelUploads: 1,
          maxFilesize: 5,
          acceptedFiles: '.jpg,.jpeg,.png,.gif',
          addRemoveLinks: true,
          maxFiles: 1,
          autoProcessQueue: false,
          timeout: 180000, // Increase timeout to 3 minutes
          createImageThumbnails: true,
          dictDefaultMessage: 'Drop files here or click to upload',
          dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
          dictInvalidFileType: 'Invalid file type.',
        })

        this.dropzone.on('addedfile', (file) => {
          if (this.dropzone.files.length > 1) {
            this.dropzone.removeFile(this.dropzone.files[0])
          }
          this.handleLogoUpload(file)
        })

        this.dropzone.on('removedfile', () => {
          this.uploadedLogo = null
          this.formData.logo_url = ''
        })

        this.dropzone.on('error', (file) => {
          // console.error('Dropzone error:', errorMessage)
          // this.toast.error(typeof errorMessage === 'string' ? errorMessage : 'Upload failed')
          this.dropzone.removeFile(file)
        })

        this.dropzone.on('success', (file, response) => {
          console.log('Upload success:', response)
        })
      }

      // Initialize Tagify
      const tagifyBasicEl = document.querySelector('#ecommerce-product-tags')
      if (tagifyBasicEl) {
        this.tagify = new Tagify(tagifyBasicEl)
      }

      // Initialize Flatpickr
      const productDate = document.querySelector('.product-date')
      if (productDate) {
        flatpickr(productDate, {
          monthSelectorType: 'static',
          defaultDate: new Date(),
        })
      }

      // Initialize Select2
      $('.select2').each(function () {
        const $this = $(this)
        $this.wrap('<div class="position-relative"></div>').select2({
          dropdownParent: $this.parent(),
          placeholder: $this.data('placeholder'),
        })
      })

      // Update Form Repeater initialization
      try {
        if ($('.form-repeater').length) {
          $('.form-repeater').repeater({
            show: function () {
              $(this).slideDown()
              // Reinitialize Select2 for new elements
              $(this).find('.select2-container').remove()
              $(this).find('.select2').select2({
                placeholder: 'Select option',
              })
            },
            hide: function (deleteElement) {
              $(this).slideUp(deleteElement)
            },
            ready: function () {
              // Called when the form is ready
            },
          })
        }
      } catch (error) {
        console.error('Error initializing repeater:', error)
      }

      // Initialize Select2 after repeater
      this.$nextTick(() => {
        try {
          $('.select2').each(function () {
            const $this = $(this)
            // Destroy existing instance if any
            if ($this.hasClass('select2-hidden-accessible')) {
              $this.select2('destroy')
            }
            // Remove existing wrapper if any
            if ($this.parent().hasClass('position-relative')) {
              $this.unwrap()
            }
            // Initialize new instance
            $this.wrap('<div class="position-relative"></div>')
            $this.select2({
              dropdownParent: $this.parent(),
              placeholder: $this.data('placeholder') || 'Select an option',
            })
          })
        } catch (error) {
          console.warn('Select2 initialization warning:', error)
        }
      })

      // Initialize typeahead for search inputs
      try {
        const searchInputs = $('input[type="search"]')
        if (searchInputs.length) {
          searchInputs.each(function () {
            $(this).typeahead(
              {
                hint: true,
                highlight: true,
                minLength: 1,
              },
              {
                name: 'search',
                source: function (query, sync) {
                  // Your search logic here
                  sync([])
                },
              },
            )
          })
        }
      } catch (error) {
        console.warn('Typeahead initialization warning:', error)
      }
    },

    handleLogoUpload(file) {
      if (!file) return

      this.uploadedLogo = file
      this.formData.logo_url = ''

      // Create a promise to handle the upload
      return new Promise((resolve, reject) => {
        this.uploadFile(file, 'logo')
          .then((url) => {
            if (url) {
              this.formData.logo_url = url
              this.toast.success('Logo uploaded successfully')
              resolve(url)
            } else {
              throw new Error('No valid URL received from server')
            }
          })
          .catch((error) => {
            console.error('Logo upload failed:', error)
            this.uploadedLogo = null
            if (this.dropzone) {
              this.dropzone.removeFile(file)
            }
            this.toast.error(`Logo upload failed: ${error.message}`)
            reject(error)
          })
      })
    },

    async handleFileUpload(event, type) {
      const files = Array.from(event.target.files)
      this.uploadedFiles[type] = files

      const formatType = (type) => {
        return type
          .split('_') // Split the string into an array by underscores
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' ') // Join the array back into a string with spaces
      }
      try {
        const uploadPromises = files.map((file) => this.uploadFile(file, type))
        const urls = await Promise.all(uploadPromises)
        this.formData[type] = urls

        const formattedType = formatType(type)
        this.toast.success(`${formattedType} uploaded successfully`)
      } catch (error) {
        const formattedType = formatType(type)
        console.error(`${formattedType} upload failed:`, error)
        this.uploadedFiles[type] = []
        this.formData[type] = []
        this.toast.error(`Failed to upload ${formattedType}: ${error.message}`)
      }
    },

    async uploadFile(file, type = 'general') {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type) // Add file type for backend processing

      try {
        const headers = config.getHeaders()
        delete headers['Content-Type']

        const response = await fetch(`${config.apiUrl}/upload`, {
          method: 'POST',
          body: formData,
          headers,
        })

        const result = await response.json()
        console.log('Upload response:', result) // Debug response

        if (!response.ok) {
          throw new Error(result.message || `Upload failed: ${response.status}`)
        }

        // Check all possible URL fields in response
        const fileUrl = result.file_url || result.url || result.data?.url || result.data?.file_url

        if (!fileUrl) {
          console.error('Invalid server response:', result)
          throw new Error('Server did not return a valid file URL')
        }

        return fileUrl
      } catch (error) {
        console.error(`Upload error (${type}):`, error)
        this.toast.error(`Failed to upload ${type}: ${error.message}`)
        throw error
      }
    },

    async submitForm() {
      try {
        // if (!this.merchantStore.validateMerchantData(this.formData)) {
        //   this.toast.error('Please fill in all required fields')
        //   return
        // }

        if (!this.formData.logo_url) {
          this.toast.error('Please upload company logo')
          return
        }

        // Prepare submission data
        const submitData = {
          ...this.formData,
          branch_locations: Array.isArray(this.formData.branch_locations)
            ? this.formData.branch_locations
            : this.formData.branch_locations.split(',').map((item) => item.trim()),
          established_year: Number(this.formData.established_year) || null,
          user_id: Number(this.formData.user_id),
        }

        // Submit to store
        const result = await this.merchantStore.createMerchant(submitData)

        if (result) {
          this.toast.success('Merchant created successfully')
          await this.$nextTick()
          this.cleanupComponents()

          // Use the route path instead of name
          await this.$router.push('/merchants')
        }
      } catch (error) {
        console.error('Submission error:', error)
        this.toast.error(error.message || 'Failed to create merchant')
      }
    },

    cleanupComponents() {
      try {
        // Add typeahead cleanup
        $('input[type="search"]').typeahead('destroy')
        $('.select2').each(function () {
          try {
            if ($(this).hasClass('select2-hidden-accessible')) {
              $(this).select2('destroy')
            }
            if ($(this).parent().hasClass('position-relative')) {
              $(this).unwrap()
            }
          } catch (e) {
            console.warn('Select2 cleanup warning:', e)
          }
        })
        if (this.editor) this.editor = null
        if (this.dropzone) this.dropzone.destroy()
        if (this.tagify) this.tagify.destroy()
      } catch (error) {
        console.warn('Cleanup warning:', error)
      }
    },

    initializeSelect2() {
      try {
        $('.select2').each(function () {
          // Clean up existing instance if any
          if ($(this).hasClass('select2-hidden-accessible')) {
            $(this).select2('destroy')
          }

          const $this = $(this)
          if (!$this.parent().hasClass('position-relative')) {
            $this.wrap('<div class="position-relative"></div>')
          }

          $this.select2({
            dropdownParent: $this.parent(),
            placeholder: $this.data('placeholder'),
          })
        })
      } catch (error) {
        console.warn('Select2 initialization warning:', error)
      }
    },

    async loadCountries() {
      try {
        const response = await axios.get(
          'https://restcountries.com/v3.1/all?fields=name,cca2,flags',
        )

        this.locationData.countries = response.data
          .map((country) => ({
            id: country.cca2,
            name: country.name.common,
            flag: country.flags.svg || country.flags.png,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      } catch (error) {
        console.error('Failed to load countries:', error)
        this.toast.error('Failed to load countries')
      }
    },

    async loadProvinces() {
      this.formData.province = ''
      this.formData.city = ''
      this.formData.zip_code = ''

      if (!this.formData.country) {
        this.locationData.provinces = []
        return
      }

      try {
        // Using GeoNames API (you'll need to register for a username at geonames.org)
        const GEONAMES_USERNAME = 'your_username' // Replace with your GeoNames username
        const response = await axios.get(
          `http://api.geonames.org/searchJSON?country=${this.formData.country}&featureClass=A&featureCode=ADM1&maxRows=1000&username=${GEONAMES_USERNAME}`,
        )

        if (response.data && response.data.geonames) {
          this.locationData.provinces = response.data.geonames
            .map((province) => ({
              id: province.adminCode1,
              name: province.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        }

        // Alternative approach using OpenCage API if GeoNames doesn't work well
        // const query = encodeURIComponent(this.formData.country)
        // const response = await axios.get(
        //   `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${this.OPENCAGE_API_KEY}&limit=1&language=en`
        // )

        // if (response.data.results && response.data.results[0]) {
        //   // Try to get state/province information from different possible component names
        //   const components = response.data.results[0].components
        //   const stateInfo = []
        //
        //   // Check various possible keys for state/province information
        //   const stateKeys = [
        //     'state',
        //     'province',
        //     'county',
        //     'region',
        //     'state_district',
        //     'state_code'
        //   ]
        //
        //   stateKeys.forEach(key => {
        //     if (components[key]) {
        //       stateInfo.push({
        //         id: components[key],
        //         name: components[key]
        //       })
        //     }
        //   })
        //
        //   this.locationData.provinces = stateInfo
        // }

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
        this.locationData.provinces = []
      }
    },

    async loadCities() {
      this.formData.city = ''
      this.formData.zip_code = ''

      if (!this.formData.province) {
        this.locationData.cities = []
        return
      }

      try {
        const query = `${this.formData.province}, ${this.formData.country}`
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${this.OPENCAGE_API_KEY}&limit=10`,
        )

        if (response.data.results) {
          this.locationData.cities = response.data.results
            .filter((result) => result.components.city || result.components.town)
            .map((result) => ({
              id: result.components.city || result.components.town,
              name: result.components.city || result.components.town,
              zip: result.components.postcode || '',
            }))
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
    },

    async updateZipCode() {
      if (!this.formData.city) {
        this.formData.zip_code = ''
        return
      }

      try {
        const query = `${this.formData.city}, ${this.formData.province}, ${this.formData.country}`
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${this.OPENCAGE_API_KEY}&limit=1`,
        )

        if (response.data.results && response.data.results[0]) {
          const postcode = response.data.results[0].components.postcode
          this.formData.zip_code = postcode || ''
        }
      } catch (error) {
        console.error('Failed to update zip code:', error)
        this.toast.error('Failed to update zip code')
      }
    },

    // Add this helper method
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
  },
  beforeUnmount() {
    this.cleanupComponents()
  },
}
</script>

<template>
  <div class="app-ecommerce">
    <!-- Header -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Add New Merchant</h4>
        <p class="mb-0">Add new merchant details</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button class="btn btn-label-secondary">Discard</button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Submit</button>
      </div>
    </div>

    <div class="row">
      <!-- First column-->
      <div class="col-12 col-lg-8">
        <!-- Basic Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Basic Information</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label">Company Name*</label>
                <input v-model="formData.company_name" type="text" class="form-control" required />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Slogan</label>
                <input v-model="formData.slogan" type="text" class="form-control" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Business Type*</label>
                <select v-model="formData.business_type" class="form-select select2" required>
                  <option value="">Select Type</option>
                  <option v-for="type in businessTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Established Year</label>
                <select v-model="formData.established_year" class="form-select select2">
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div class="col-12 mb-4">
                <label class="form-label">Select User*</label>
                <select v-model="formData.user_id" class="form-select select2" required>
                  <option value="">Select User</option>
                  <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                    {{ user.first_name }} {{ user.last_name }} ({{ user.email }})
                  </option>
                </select>
                <small class="text-muted"
                  >User's contact information will be used for merchant registration</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Contact Information</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label">Country*</label>
                <select id="country-select" v-model="formData.country" class="form-select" required>
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
                  v-model="formData.province"
                  class="form-select"
                  required
                  :disabled="!formData.country"
                >
                  <option value="">Select Province</option>
                  <option
                    v-for="province in locationData.provinces"
                    :key="province.id"
                    :value="province.id"
                  >
                    {{ province.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">City*</label>
                <select
                  id="city-select"
                  v-model="formData.city"
                  class="form-select"
                  required
                  :disabled="!formData.province"
                >
                  <option value="">Select City</option>
                  <option v-for="city in locationData.cities" :key="city.id" :value="city.id">
                    {{ city.name }}
                  </option>
                </select>
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">ZIP Code</label>
                <input v-model="formData.zip_code" type="text" class="form-control" readonly />
              </div>

              <div class="col-md-12 mb-4">
                <label class="form-label">Detailed Address*</label>
                <input
                  v-model="formData.address_details"
                  type="text"
                  class="form-control"
                  required
                  placeholder="Street address, building name, etc."
                />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Headquarters Location*</label>
                <input
                  v-model="formData.headquarters_location"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Branch Locations</label>
                <input
                  v-model="formData.branch_locations"
                  type="text"
                  class="form-control"
                  placeholder="Separate with commas"
                />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Phone Number*</label>
                <input v-model="formData.phone_number" type="tel" class="form-control" required />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Email Address*</label>
                <input
                  v-model="formData.email_address"
                  type="email"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Website</label>
                <input v-model="formData.website" type="url" class="form-control" />
              </div>
            </div>
          </div>
        </div>

        <!-- Legal Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Legal Information</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-4">
                <label class="form-label">Registration Number*</label>
                <input
                  v-model="formData.registration_number"
                  type="text"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">Tourism License Number</label>
                <input v-model="formData.tourism_license_number" type="text" class="form-control" />
              </div>

              <div class="col-md-6 mb-4">
                <label class="form-label">TIN Number</label>
                <input v-model="formData.tin" type="text" class="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second column -->
      <div class="col-12 col-lg-4">
        <div class="card-header">
          <h5 class="card-title mb-0">Company Logo</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12 mb-4">
              <label class="form-label">Company Logo*</label>
              <div class="dropzone" id="dropzone-basic">
                <div class="dz-message needsclick">
                  <div class="mb-3">
                    <i class="mdi mdi-cloud-upload display-5"></i>
                  </div>
                  <h5 class="mb-0">Drop files here or click to upload</h5>
                  <span class="text-muted">Allowed JPG, JPEG, PNG, GIF. Max size of 5MB.</span>
                  <div v-if="formData.logo_url" class="mt-3">
                    <img :src="formData.logo_url" alt="Preview" style="max-width: 200px" />
                    <p class="text-success mt-2">Logo uploaded successfully</p>
                  </div>
                </div>
              </div>
              <small class="text-danger" v-if="!formData.logo_url">Company logo is required</small>
            </div>
          </div>
        </div>
        <!-- Contact Person -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Contact Person</h5>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label">Name*</label>
              <input
                v-model="formData.contact_person_name"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Position/Designation*</label>
              <input
                v-model="formData.position_designation"
                type="text"
                class="form-control"
                required
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Emergency Contact Number</label>
              <input v-model="formData.emergency_contact_number" type="tel" class="form-control" />
            </div>
          </div>
        </div>

        <!-- Social Media Links -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Social Media</h5>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label">Facebook</label>
              <input
                v-model="formData.social_media_links.facebook"
                type="url"
                class="form-control"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Twitter</label>
              <input
                v-model="formData.social_media_links.twitter"
                type="url"
                class="form-control"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Instagram</label>
              <input
                v-model="formData.social_media_links.instagram"
                type="url"
                class="form-control"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Youtube</label>
              <input
                v-model="formData.social_media_links.youtube"
                type="url"
                class="form-control"
              />
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Documents</h5>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label">Business Permits</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept=".pdf"
                @change="(e) => handleFileUpload(e, 'business_permits')"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Membership Certificates</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept=".pdf"
                @change="(e) => handleFileUpload(e, 'membership_certificates')"
              />
            </div>
            <div class="mb-4">
              <label class="form-label">Other Documents</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept=".pdf"
                @change="(e) => handleFileUpload(e, 'documents')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-separator {
  position: relative;
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    height: 100%;
    background-color: #eee;
  }
}

// Add Select2 custom styles
.select2-container {
  width: 100% !important;

  .select2-selection {
    height: 38px;
    padding: 5px;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;

    &--single {
      display: flex;
      align-items: center;
    }
  }

  .select2-selection__rendered {
    img.flag-icon {
      width: 20px;
      height: 15px;
      margin-right: 8px;
      vertical-align: middle;
      object-fit: cover;
    }
  }
  img.flag-icon {
    width: 20px;
  }
}

// Add styles for dropdown flags
.select2-results__option {
  img.flag-icon {
    width: 20px;
    height: 15px;
    margin-right: 8px;
    vertical-align: middle;
    object-fit: cover;
  }
}
</style>
