<script>
import { useMerchantsStore } from '@/stores/merchant/AddMerchant'
import config from '../config/config'
import Quill from 'quill'
import Dropzone from 'dropzone'
import Tagify from '@yaireo/tagify'
import flatpickr from 'flatpickr'
import { useToast } from 'vue-toastification'
import { useUsersStore } from '@/stores/users'
import AddressBlock from '@/components/AddressBlock.vue'

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

Dropzone.autoDiscover = false

export default {
  name: 'AddMerchants',
  components: {
    AddressBlock,
  },
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
        addressDetails: {
          country: '',
          province: '',
          city: '',
          zip_code: '',
          address_details: '',
        },
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

        console.log('Submission result:', result)

        if (result) {
          this.toast.success('Merchant created successfully')
          await this.$nextTick()
          this.cleanupComponents()
          console.log('Redirecting to merchants page...')

          // Use the route path instead of name
          router.push('/merchants')
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
            <AddressBlock v-model="formData.addressDetails" />

            <!-- Keep other contact fields -->
            <div class="row">
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
