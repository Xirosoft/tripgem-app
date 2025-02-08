<script setup>
import { useAuthStore } from '@/stores/auth'
import Dropzone from 'dropzone'
import $ from 'jquery'
import { onMounted, ref } from 'vue'
import MerchantUsers from '../../components/tour/MerchantUsers.vue'
import TourCategory from '../../components/tour/TourCategory.vue'
import TourLocation from '../../components/tour/TourLocation.vue'
import TourTags from '../../components/tour/TourTags.vue'
import config from '../../config/config'
import { useToursStore } from '../../stores/tour/AddTour'
import { initializeAddTour } from '../../stores/tour/initializeAddTour'

const userId = useAuthStore().userId

const toursStore = useToursStore()
const formData = ref({
  merchant_id: '',
  user_id: userId,
  tour_name: '',
  subheading: '',
  description: '',
  itinerary: '',
  tour_start_time: '',
  tour_end_time: '',
  regular_price_adult: 0,
  net_price_adult: 0,
  regular_price_child: 0,
  net_price_child: 0,
  available_dates: '',
  available_seat: 0,
  total_seat: 0,
  image_gallery: [],
  video_gallery: [],
  thumbnail: '',
  transport_types: '',
  languages_supported: '',
  highlights: '',
  min_age: 0,
  max_age: 0,
  cancellation_policy: '',
  discount_percentage: 0,
  tour_type: '',
  currency: '',
  status: 'draft',
  tour_meta: [],
  pick_up_time: '',
  drop_time: '',
  pickup_location_details: '',
  dropoff_location_details: '',
  duration: '',
})

const handleMerchantUserChange = (merchantId, userId) => {
  formData.value.merchant_id = merchantId
  formData.value.user_id = userId
  console.log('Merchant ID:', merchantId, 'User ID:', userId)
}

const addMetaField = () => {
  formData.value.tour_meta.push({ key: '', value: '' })
}

const removeMetaField = (index) => {
  formData.value.tour_meta.splice(index, 1)
}

const handleThumbnailUpload = (file) => {
  formData.value.thumbnail = file.url
}

const handleImageGalleryUpload = (file) => {
  formData.value.image_gallery.push(file.url)
}

const handleVideoGalleryUpload = (file) => {
  formData.value.video_gallery.push(file.url)
}

const handleSubmit = async () => {
  try {
    await toursStore.createTour(formData.value)
    alert('Tour created successfully!')
  } catch (error) {
    alert('Failed to create tour: ' + error.message)
  }
}

// previewTemplate: Updated Dropzone default previewTemplate
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
    file.url = response.url // Assuming the response contains the URL
    uploadHandler(file)
    console.log('Upload success:', response)
  })

  return dropzoneInstance
}

onMounted(() => {
  initializeAddTour(handleThumbnailUpload, handleVideoGalleryUpload)
  $('.select2').select2() // Initialize select2 for all elements with class 'select2'

  // Initialize Dropzones
  window.dropzoneThumbnail = initializeDropzone('#thumbnail', handleThumbnailUpload)
  window.dropzoneImageGallery = initializeDropzone('#image_gallery', handleImageGalleryUpload)
  window.dropzoneVideoGallery = initializeDropzone('#dropzone-basic', handleVideoGalleryUpload)
})
</script>

<template>
  <div class="app-ecommerce">
    <!-- Add Product -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Add a new Tour</h4>
        <p class="mb-0">Orders placed across your store</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button class="btn btn-label-secondary">View Tour</button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary" @click="handleSubmit">Publish Tour</button>
      </div>
    </div>

    <div class="row">
      <!-- First column-->
      <div class="col-12 col-lg-8">
        <input type="hidden" name="user_id" v-model="formData.user_id" />
        <input type="hidden" name="merchant_id" v-model="formData.merchant_id" />
        <!-- Product Information -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-tile mb-0">Tour Listing information</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label" for="tour-title">Title</label>
              <input
                type="text"
                class="form-control"
                id="tour-title"
                placeholder="Product title"
                v-model="formData.tour_name"
                aria-label="Tour title"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="tour-subtitle">Sub Title</label>
              <input
                type="text"
                class="form-control"
                id="tour-subtitle"
                placeholder="Sub title"
                v-model="formData.subheading"
                aria-label="Tour subtitle"
              />
            </div>
            <!-- Description -->
            <div>
              <label class="mb-1">Description (Optional)</label>
              <textarea
                class="form-control"
                v-model="formData.description"
                placeholder="Description"
              ></textarea>
            </div>
            <div class="mt-5">
              <label class="mb-1">Itinerary (Optional)</label>
              <textarea
                class="form-control"
                v-model="formData.itinerary"
                placeholder="Itinerary"
              ></textarea>
            </div>
            <div class="mb-6 mt-6">
              <label class="form-label" for="tour-highlights">Highlights</label>
              <textarea
                type="text"
                class="form-control"
                id="tour-highlights"
                placeholder="Highlights"
                v-model="formData.highlights"
                aria-label="Tour highlights"
              ></textarea>
            </div>
            <div class="mb-6 mt-6">
              <label class="form-label" for="tour-cancellation-policy">Cancellation Policy</label>
              <textarea
                type="text"
                class="form-control"
                id="tour-cancellation-policy"
                placeholder="Cancellation Policy"
                v-model="formData.cancellation_policy"
                aria-label="Tour cancellation policy"
              ></textarea>
            </div>
          </div>
        </div>
        <!-- /Product Information -->

        <!-- Price -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Price Section</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills flex-column w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#AdultPrice"
                        >
                          <i class="ti ti-box ti-sm me-1_5"></i>
                          <span class="align-middle">Adult Price</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          class="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tour_end_time"
                        >
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Child Price</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#age_rules">
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Age Rules</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- AdultPrice Tab -->
                  <div class="tab-pane fade show active" id="AdultPrice" role="tabpanel">
                    <h6 class="text-body">Adult Price</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="adult-regular-price">Regular Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="adult-regular-price"
                        placeholder="Regular Price"
                        v-model="formData.regular_price_adult"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="adult-net-price">Net Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="adult-net-price"
                        placeholder="Net Price"
                        v-model="formData.net_price_adult"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label" for="adult-discounted-price"
                        >Discounted Price</label
                      >
                      <input
                        type="number"
                        class="form-control"
                        id="adult-discounted-price"
                        placeholder="Discounted Price"
                        v-model="formData.discount_percentage"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <!-- Child Price Tab -->
                  <div class="tab-pane fade" id="tour_end_time" role="tabpanel">
                    <h6 class="mb-3 text-body">Child Price</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-regular-price">Regular Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-regular-price"
                        placeholder="Regular Price"
                        v-model="formData.regular_price_child"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-net-price">Net Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-net-price"
                        placeholder="Net Price"
                        v-model="formData.net_price_child"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div class="tab-pane fade" id="age_rules" role="tabpanel">
                    <h6 class="mb-3 text-body">Age Policy</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="min-age">Minimum Age</label>
                      <input
                        type="number"
                        class="form-control"
                        id="min-age"
                        placeholder="Minimum Age"
                        v-model="formData.min_age"
                        min="0"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="max-age">Max Age</label>
                      <input
                        type="number"
                        class="form-control"
                        id="max-age"
                        placeholder="Max Age"
                        v-model="formData.max_age"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Price -->
        <!-- Gallery -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Gallery Section</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills display-inline w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#photoGallery"
                        >
                          <i class="ti ti-box ti-sm me-1_5"></i>
                          <span class="align-middle">Photos</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          class="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#videoGallery"
                        >
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Videos</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- photoGallery Tab -->
                  <div class="tab-pane fade show active" id="photoGallery" role="tabpanel">
                    <h6 class="text-body">You Can Upload upload multiple Photos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <div class="dropzone needsclick p-0" id="image_gallery">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse images</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="image_gallery" type="file" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Child Price Tab -->
                  <div class="tab-pane fade" id="videoGallery" role="tabpanel">
                    <h6 class="mb-3 text-body">You can multiple videos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <div class="dropzone needsclick p-0" id="dropzone-basic">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse videos</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="video_gallery" type="file" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- /Media -->
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Gallery -->
        <!-- Inventory -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Schedule & Capacity</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills flex-column w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#tour_schedule"
                        >
                          <i class="ti ti-clock ti-sm me-1_5"></i>
                          <span class="align-middle">Tour Schedule</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#pickupTime"
                        >
                          <i class="ti ti-clock ti-sm me-1_5"></i>
                          <span class="align-middle">Pickup Time</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#dropoffTime">
                          <i class="ti ti-clock-off ti-sm me-1_5"></i>
                          <span class="align-middle">Drop-off Time</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tourDates">
                          <i class="ti ti-calendar ti-sm me-1_5"></i>
                          <span class="align-middle">Tour Dates</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#capacity">
                          <i class="ti ti-users ti-sm me-1_5"></i>
                          <span class="align-middle">Tour Capacity</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- Pickup Time Tab -->
                  <div class="tab-pane fade show active" id="tour_schedule" role="tabpanel">
                    <h6 class="text-body">Tour Start end time</h6>
                    <div class="mb-3">
                      <label class="form-label">Tour Start Time</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeStart"
                        v-model="formData.tour_start_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">End TIme</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeEnd"
                        v-model="formData.tour_end_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Tour Duration</label>
                      <input
                        type="number"
                        class="form-control"
                        id="pickupTimeEnd"
                        v-model="formData.tour_end_time"
                      />
                    </div>
                  </div>
                  <div class="tab-pane fade" id="pickupTime" role="tabpanel">
                    <h6 class="text-body">Tour Pickup Time Range</h6>
                    <div class="mb-3">
                      <label class="form-label">From</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeStart"
                        v-model="formData.pick_up_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">To</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeEnd"
                        v-model="formData.drop_time"
                      />
                    </div>
                  </div>
                  <!-- Drop-off Time Tab -->
                  <div class="tab-pane fade" id="dropoffTime" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Drop-off Time Range</h6>
                    <div class="mb-3">
                      <label class="form-label">From</label>
                      <input
                        type="time"
                        class="form-control"
                        id="dropoffTimeStart"
                        v-model="formData.drop_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">To</label>
                      <input
                        type="time"
                        class="form-control"
                        id="dropoffTimeEnd"
                        v-model="formData.drop_time"
                      />
                    </div>
                  </div>
                  <!-- Tour Dates Tab -->
                  <div class="tab-pane fade" id="tourDates" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Availability</h6>
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label">Start Date</label>
                        <input
                          type="date"
                          class="form-control"
                          id="tourStartDate"
                          name="tourStartDate"
                          v-model="formData.available_dates"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">End Date</label>
                        <input
                          type="date"
                          class="form-control"
                          id="tourEndDate"
                          name="tourEndDate"
                        />
                      </div>
                    </div>
                    <div class="mb-4">
                      <label class="form-label">Operating Days</label>
                      <div class="d-flex flex-wrap gap-2">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="monday"
                            name="operatingDays"
                            value="monday"
                          />
                          <label class="form-check-label" for="monday">Monday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="tuesday"
                            name="operatingDays"
                            value="tuesday"
                          />
                          <label class="form-check-label" for="tuesday">Tuesday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="wednesday"
                            name="operatingDays"
                            value="wednesday"
                          />
                          <label class="form-check-label" for="wednesday">Wednesday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="thursday"
                            name="operatingDays"
                            value="thursday"
                          />
                          <label class="form-check-label" for="thursday">Thursday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="friday"
                            name="operatingDays"
                            value="friday"
                          />
                          <label class="form-check-label" for="friday">Friday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="saturday"
                            name="operatingDays"
                            value="saturday"
                          />
                          <label class="form-check-label" for="saturday">Saturday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="sunday"
                            name="operatingDays"
                            value="sunday"
                          />
                          <label class="form-check-label" for="sunday">Sunday</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Capacity Tab -->
                  <div class="tab-pane fade" id="capacity" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Capacity Settings</h6>
                    <div class="mb-3">
                      <p class="mb-0"><b>Total Seats</b></p>
                      <label class="form-label" for="maxCapacity">Maximum Capacity</label>
                      <input
                        type="number"
                        class="form-control"
                        id="maxCapacity"
                        name="maxCapacity"
                        min="1"
                        placeholder="Enter maximum number of guests"
                        v-model="formData.total_seat"
                      />
                    </div>
                    <div class="mb-3">
                      <p class="mb-0"><b>Available Seats</b></p>
                      <label class="form-label" for="minGuests">Minimum Guests Required</label>
                      <input
                        type="number"
                        class="form-control"
                        id="minGuests"
                        name="minGuests"
                        min="1"
                        v-model="formData.available_seat"
                        placeholder="Enter minimum guests required"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Tour Schedule & Capacity -->

        <!-- Variants -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Meta</h5>
          </div>
          <div class="card-body">
            <form class="form-repeater">
              <div v-for="(meta, index) in formData.tour_meta" :key="index" class="row mb-3">
                <div class="col-4">
                  <label class="form-label">Meta Key</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="meta.key"
                    placeholder="Enter key"
                  />
                </div>
                <div class="col-6">
                  <label class="form-label">Meta Value</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="meta.value"
                    placeholder="Enter value"
                  />
                </div>
                <div class="col-2 d-flex align-items-end">
                  <button type="button" class="btn btn-danger" @click="removeMetaField(index)">
                    x
                  </button>
                </div>
              </div>
              <div>
                <button type="button" class="btn btn-primary" @click="addMetaField">
                  <i class="ti ti-plus ti-xs me-2"></i>
                  Add another Meta
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- /Variants -->
      </div>
      <!-- Second column -->
      <div class="col-12 col-lg-4">
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Status </label>
          <select
            id="status-org"
            class="select2 form-select"
            data-placeholder="Published"
            v-model="formData.status"
          >
            <option value="Published">Published</option>
            <option value="Published" selected>Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Pricing Card -->
        <div class="card mb-6">
          <div class="card-body">
            <!-- Base Price -->
            <!-- Instock switch -->
            <div class="d-flex justify-content-between align-items-center pt-2">
              <span class="mb-0">Booking Availability</span>
              <div class="w-25 d-flex justify-content-end">
                <div class="form-check form-switch me-n3">
                  <input type="checkbox" class="form-check-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Pricing Card -->

        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Tour Type </label>
          <select
            id="tour-type"
            class="select2 form-select"
            data-placeholder="Select Tour Type"
            v-model="formData.tour_type"
          >
            <option value="Group">Group</option>
            <option value="Private">Private</option>
            <option value="Adventure">Adventure</option>
            <option value="Luxury">Luxury</option>
            <option value="Cultural">Cultural</option>
            <option value="Beach">Beach</option>
            <option value="Eco">Eco</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Transportation Type </label>
          <select
            id="transport-type"
            class="select2 form-select"
            data-placeholder="Select Transportation"
            v-model="formData.transport_types"
          >
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Flight</option>
            <option value="Boat">Boat</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Motorbike">Motorbike</option>
            <option value="Ferry">Ferry</option>
            <option value="Speedboat">Speedboat</option>
            <option value="Catamaran">Catamaran</option>
            <option value="Longtail Boat">Longtail Boat</option>
            <option value="Van">Van</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Guide Language Support</label>
          <select
            id="language"
            class="select2 form-select"
            data-placeholder="Select Language"
            multiple
            v-model="formData.languages_supported"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Thai">Thai</option>
            <option value="Russian">Russian</option>
            <option value="Arabic">Arabic</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Currency Support</label>
          <select
            id="currency"
            class="select2 form-select"
            data-placeholder="Select Currency"
            multiple
            v-model="formData.currency"
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="THB">Thai Baht (THB)</option>
            <option value="AUD">Australian Dollar (AUD)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
            <option value="SGD">Singapore Dollar (SGD)</option>
            <option value="JPY">Japanese Yen (JPY)</option>
            <option value="CNY">Chinese Yuan (CNY)</option>
            <option value="INR">Indian Rupee (INR)</option>
            <option value="AED">UAE Dirham (AED)</option>
            <option value="CHF">Swiss Franc (CHF)</option>
            <option value="HKD">Hong Kong Dollar (HKD)</option>
            <option value="NZD">New Zealand Dollar (NZD)</option>
            <option value="KRW">South Korean Won (KRW)</option>
            <option value="BRL">Brazilian Real (BRL)</option>
            <option value="MXN">Mexican Peso (MXN)</option>
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="RUB">Russian Ruble (RUB)</option>
            <option value="SEK">Swedish Krona (SEK)</option>
            <option value="NOK">Norwegian Krone (NOK)</option>
            <option value="DKK">Danish Krone (DKK)</option>
            <option value="MYR">Malaysian Ringgit (MYR)</option>
            <option value="IDR">Indonesian Rupiah (IDR)</option>
            <option value="PHP">Philippine Peso (PHP)</option>
            <option value="VND">Vietnamese Dong (VND)</option>
            <option value="SAR">Saudi Riyal (SAR)</option>
            <option value="EGP">Egyptian Pound (EGP)</option>
            <option value="PLN">Polish Złoty (PLN)</option>
            <option value="TRY">Turkish Lira (TRY)</option>
            <option value="HUF">Hungarian Forint (HUF)</option>
            <option value="CZK">Czech Koruna (CZK)</option>
            <option value="TWD">Taiwan Dollar (TWD)</option>
            <option value="ARS">Argentine Peso (ARS)</option>
            <option value="COP">Colombian Peso (COP)</option>
            <option value="PKR">Pakistani Rupee (PKR)</option>
            <option value="BDT">Bangladeshi Taka (BDT)</option>
            <option value="LKR">Sri Lankan Rupee (LKR)</option>
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="GHS">Ghanaian Cedi (GHS)</option>
          </select>
        </div>

        <!-- Organize Card -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Organize</h5>
          </div>
          <div class="card-body">
            <MerchantUsers @merchant-user-change="handleMerchantUserChange" />
            <!-- Merchants -->

            <TourLocation />
            <TourCategory />
            <TourTags />
          </div>
        </div>
        <!-- /Organize Card -->

        <!-- Media -->
        <div class="card mb-6">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 card-title">Thumbnail</h5>
          </div>
          <div class="card-body">
            <div class="dropzone needsclick p-0" id="thumbnail">
              <div class="dz-message needsclick">
                <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                <span class="note needsclick btn btn-sm btn-label-primary" id="btnBrowse"
                  >Browse image</span
                >
              </div>
              <div class="fallback">
                <input name="thumbnail" type="file" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Second column -->
    </div>
  </div>
</template>

<style>
@import 'dropzone/dist/dropzone.css';
@import '@yaireo/tagify/dist/tagify.css';
@import 'quill/dist/quill.snow.css';
@import 'select2/dist/css/select2.css';
@import 'flatpickr/dist/flatpickr.css';

body .select2-container .select2-selection--single {
  height: auto;
}
body .select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
