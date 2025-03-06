<script>
import AddressBlock from '@/components/AddressBlock.vue'
import { useEditMerchantStore } from '@/stores/merchant/EditMerchant'
import { useUsersStore } from '@/stores/users'
import { DragAndDropUpload, handleFileUpload } from '@/utils/handleFileUpload'
import Dropzone from 'dropzone'
import jQuery from 'jquery'
import select2 from 'select2'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
const $ = jQuery
window.$ = window.jQuery = jQuery
select2() // Initialize select2

import '@yaireo/tagify/dist/tagify.css'
import 'dropzone/dist/dropzone.css'
import 'flatpickr/dist/flatpickr.css'
import 'jquery.repeater/jquery.repeater.js'
import 'jquery.repeater/jquery.repeater.min.js'
import 'quill/dist/quill.snow.css'
import 'select2/dist/css/select2.css'
import 'select2/dist/js/select2.full.js'

// Add typeahead import
import 'typeahead.js'

Dropzone.autoDiscover = false

export default {
  name: 'EditMerchant',
  components: {
    AddressBlock,
  },
  setup() {
    const toast = useToast()
    const editMerchantStore = useEditMerchantStore()
    const usersStore = useUsersStore()
    const router = useRouter()
    const route = useRoute()

    return { toast, editMerchantStore, usersStore, router, route }
  },
  data() {
    return {
      editor: null,
      dropzone: null,
      dropzoneCoverPhoto: null, // Add this line
      tagify: null,
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
      uploadedCoverPhoto: null, // Add this line
      uploadedFiles: {
        business_permits: [],
        membership_certificates: [],
        documents: [],
      },
      users: [],
      formData: {
        company_name: '',
        slogan: '',
        business_type: '',
        established_year: '',
        user_id: '',
        address: {
          country: '',
          province: '',
          city: '',
          zip_code: '',
          address_details: '',
        },
        headquarters_location: '',
        branch_locations: '',
        phone_number: '',
        email_address: '',
        website: '',
        registration_number: '',
        tourism_license_number: '',
        tin: '',
        logo_url: '',
        contact_person_name: '',
        position_designation: '',
        emergency_contact_number: '',
        social_media_links: {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: '',
          line: '',
        },
        status: '',
      },
    }
  },
  async created() {
    try {
      await this.usersStore.fetchVerifiedUsers() // Correct method name
      this.users = this.usersStore.getVerifiedUsers // Ensure getter is used correctly
      await this.fetchMerchantData()
    } catch (error) {
      console.error('Failed to load users or merchant data:', error)
      this.toast.error('Failed to load users or merchant data')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeComponents()
    })
  },
  methods: {
    async fetchMerchantData() {
      try {
        const response = await this.editMerchantStore.fetchMerchantById(this.$route.params.id)
        this.formData = { ...response.data }
        // Ensure social_media_links is an object
        if (typeof this.formData.social_media_links === 'string') {
          this.formData.social_media_links = JSON.parse(this.formData.social_media_links)
        } else if (!this.formData.social_media_links) {
          this.formData.social_media_links = {
            facebook: '',
            twitter: '',
            instagram: '',
            youtube: '',
            line: '',
          }
        }
        // Ensure address is an object
        if (typeof this.formData.address !== 'object' || this.formData.address === null) {
          this.formData.address = {
            country: '',
            province: '',
            city: '',
            zip_code: '',
            address_details: '',
          }
        }
        // Set uploadedLogo and uploadedCoverPhoto if they exist
        this.uploadedLogo = this.formData.logo_url || null
        this.uploadedCoverPhoto = this.formData.cover_photo || null
        // Set uploadedFiles if they exist
        this.uploadedFiles.business_permits = this.formData.business_permits || []
        this.uploadedFiles.membership_certificates = this.formData.membership_certificates || []
        this.uploadedFiles.documents = this.formData.documents || []
        // Reinitialize Select2 components
        this.$nextTick(() => {
          this.initializeSelect2()
        })
      } catch (error) {
        console.error('Failed to fetch merchant data:', error)
        this.toast.error('Failed to fetch merchant data')
      }
    },

    initializeComponents() {
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

      const initializeDropzone = (elementId, uploadHandler) => {
        const dropzoneElement = document.querySelector(elementId)
        if (!dropzoneElement) return null

        const dropzoneInstance = new Dropzone(dropzoneElement, {
          url: `${config.apiUrl}/upload`,
          headers: config.getHeaders(),
          previewTemplate,
          parallelUploads: 1,
          maxFilesize: 5,
          acceptedFiles: '.jpg,.jpeg,.png,.gif',
          addRemoveLinks: true,
          maxFiles: 1,
          autoProcessQueue: false,
          timeout: 180000,
          createImageThumbnails: true,
          dictDefaultMessage: 'Drop files here or click to upload',
          dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
          dictInvalidFileType: 'Invalid file type.',
        })

        dropzoneInstance.on('addedfile', (file) => {
          if (dropzoneInstance.files.length > 1) {
            dropzoneInstance.removeFile(dropzoneInstance.files[0])
          }
          uploadHandler(file)
        })

        dropzoneInstance.on('removedfile', () => {
          const isLogo = elementId === '#dropzone-basic'
          if (isLogo) {
            this.uploadedLogo = null
            this.formData.logo_url = ''
          } else {
            this.uploadedCoverPhoto = null
            this.formData.cover_photo = ''
          }
        })

        dropzoneInstance.on('error', (file) => {
          dropzoneInstance.removeFile(file)
        })

        dropzoneInstance.on('success', (file, response) => {
          console.log('Upload success:', response)
        })

        return dropzoneInstance
      }

      // Initialize both dropzones using the common function
      this.dropzone = initializeDropzone('#dropzone-basic', this.handleLogoUpload)
      this.dropzoneCoverPhoto = initializeDropzone(
        '#dropzone-cover-photo',
        this.handleCoverPhotoUpload,
      )

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

    async handleFileUpload(event, key) {
      const files = await handleFileUpload(event, key)
      if (files.length > 0) {
        this.uploadedFiles[key] = files.map((file) => file.url) // Ensure only URLs are stored
        this.formData[key] = this.uploadedFiles[key] // Store all URLs
      }
    },

    handleLogoUpload(file) {
      DragAndDropUpload(file, this.formData, this.dropzone, this.toast, 'logo_url')
    },
    handleCoverPhotoUpload(file) {
      DragAndDropUpload(file, this.formData, this.dropzoneCoverPhoto, this.toast, 'cover_photo')
    },

    async submitForm() {
      try {
        if (!this.formData.logo_url && !this.uploadedLogo) {
          this.toast.error('Please upload company logo')
          return
        }
        if (!this.formData.cover_photo && !this.uploadedCoverPhoto) {
          this.toast.error('Please upload cover photo')
          return
        }

        // Ensure social_media_links is an object
        if (typeof this.formData.social_media_links === 'string') {
          this.formData.social_media_links = JSON.parse(this.formData.social_media_links)
        }

        // Prepare submission data
        const submitData = {
          ...this.formData,
          branch_locations: this.formData.branch_locations
            ? this.formData.branch_locations
            : this.formData.branch_locations.split(',').map((item) => item.trim()),
          established_year: Number(this.formData.established_year) || null,
          user_id: Number(this.formData.user_id),
          logo_url: this.formData.logo_url.url || this.uploadedLogo,
          cover_photo: this.formData.cover_photo.url || this.uploadedCoverPhoto,
        }

        console.log('Submit data:', submitData)
        // Submit to store
        const result = await this.editMerchantStore.updateMerchant(
          this.$route.params.id,
          submitData,
        )

        console.log('Submission result:', result)

        if (result) {
          this.toast.success('Merchant updated successfully')
          await this.$nextTick()
          this.cleanupComponents()
        }
      } catch (error) {
        console.error('Submission error:', error)
        // Show API error message if available
        if (error.response?.data?.message) {
          this.toast.error(error.response.data.message)
        } else {
          this.toast.error('Failed to update merchant')
        }
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
        <h4 class="mb-1">Edit Merchant</h4>
        <p class="mb-0">Edit merchant details</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button
            class="btn btn-label-secondary"
            @click="router.push(`/merchant/view/${route.params.id}`)"
          >
            View Merchant
          </button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary" @click.prevent="submitForm">Update</button>
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
            <AddressBlock v-model="formData.address" />

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
        <div class="col-12 mb-4">
          <label class="form-label" for="edit-merchant-status">Status</label>
          <select
            id="edit-merchant-status"
            class="form-select"
            v-model="formData.status"
            name="merchantStatus"
          >
            <option value="pending">Pending</option>
            <option value="reject">Reject</option>
            <option value="approved">Approved</option>
            <option value="hold">Hold</option>
            <option value="warning">Warning</option>
            <option value="suspend">Suspend</option>
          </select>
        </div>
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
                  <div v-if="uploadedLogo" class="mt-3">
                    <img :src="uploadedLogo" alt="Preview" style="max-width: 200px" />
                    <p class="text-success mt-2">Logo uploaded successfully</p>
                  </div>
                </div>
              </div>
              <small class="text-danger" v-if="!uploadedLogo">Company logo is required</small>
            </div>
          </div>
        </div>
        <div class="card-header">
          <h5 class="card-title mb-0">Cover Photo</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-12 mb-4">
              <label class="form-label">Cover Photo*</label>
              <div class="dropzone" id="dropzone-cover-photo">
                <div class="dz-message needsclick">
                  <div class="mb-3">
                    <i class="mdi mdi-cloud-upload display-5"></i>
                  </div>
                  <h5 class="mb-0">Drop files here or click to upload</h5>
                  <span class="text-muted">Allowed JPG, JPEG, PNG, GIF. Max size of 5MB.</span>
                  <div v-if="uploadedCoverPhoto" class="mt-3">
                    <img :src="uploadedCoverPhoto" alt="Preview" style="max-width: 200px" />
                    <p class="text-success mt-2">Cover photo uploaded successfully</p>
                  </div>
                </div>
              </div>
              <small class="text-danger" v-if="!uploadedCoverPhoto">Cover photo is required</small>
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
            <div class="mb-4">
              <label class="form-label">Line</label>
              <input v-model="formData.social_media_links.line" type="url" class="form-control" />
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
                @change="handleFileUpload($event, 'business_permits')"
              />
              <ul v-if="uploadedFiles.business_permits.length">
                <li v-for="(file, index) in uploadedFiles.business_permits" :key="index">
                  <a :href="file" target="_blank">{{ file }}</a>
                </li>
              </ul>
            </div>
            <div class="mb-4">
              <label class="form-label">Membership Certificates</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept=".pdf"
                @change="handleFileUpload($event, 'membership_certificates')"
              />
              <ul v-if="uploadedFiles.membership_certificates.length">
                <li v-for="(file, index) in uploadedFiles.membership_certificates" :key="index">
                  <a :href="file" target="_blank">{{ file }}</a>
                </li>
              </ul>
            </div>
            <div class="mb-4">
              <label class="form-label">Other Documents</label>
              <input
                type="file"
                class="form-control"
                multiple
                accept=".pdf"
                @change="handleFileUpload($event, 'documents')"
              />
              <ul v-if="uploadedFiles.documents.length">
                <li v-for="(file, index) in uploadedFiles.documents" :key="index">
                  <a :href="file" target="_blank">{{ file }}</a>
                </li>
              </ul>
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
