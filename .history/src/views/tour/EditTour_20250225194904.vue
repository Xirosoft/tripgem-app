<script setup>
import { useAuthStore } from '@/stores/auth'
import jQuery from 'jquery'
import Quill from 'quill'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import MerchantUsers from '../../components/tour/edit/MerchantUsers.vue'
import TourCategory from '../../components/tour/edit/TourCategory.vue'
import TourLocation from '../../components/tour/edit/TourLocation.vue'
import TourTags from '../../components/tour/edit/TourTags.vue'
import { useEditTourStore } from '../../stores/tour/EditTour'
import { initializeAddTour } from '../../stores/tour/initializeAddTour'
import { DragAndDropUpload, initializeDropzone } from '../../utils/DropzoneFileUpload'
const $ = jQuery
window.$ = window.jQuery = jQuery
const userId = useAuthStore().userId
const editTourStore = useEditTourStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()
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
  net_price_adult: { amount: 0, include_park_fee: true },
  local_net_price_adult: { amount: 0, include_park_fee: true },
  regular_price_child: 0,
  net_price_child: { amount: 0, include_park_fee: true },
  local_net_price_child: { amount: 0, include_park_fee: true },
  park_fee: {
    price_child_park_fee: 0,
    price_adult_park_fee: 0,
    local_price_adult_park_fee: 0,
    local_price_child_park_fee: 0,
  },
  discount: [], // Initialize as an empty array
  available_dates: [
    {
      from: '',
      to: '',
    },
  ],
  available_days: [
    { day: 'Monday', checked: false },
    { day: 'Tuesday', checked: false },
    { day: 'Wednesday', checked: false },
    { day: 'Thursday', checked: false },
    { day: 'Friday', checked: false },
    { day: 'Saturday', checked: false },
    { day: 'Sunday', checked: false },
  ],
  available_seat: 0,
  total_seat: 0,
  image_gallery: [],
  video_gallery: [],
  thumbnail: '',
  transport_types: '',
  languages_supported: [],
  highlights: '',
  min_age: 0,
  max_age: 0,
  cancellation_policy: '',
  discount_percentage: 0,
  tour_type: '',
  currency: [],
  tour_meta: [],
  pick_up_time: [{ from: '', to: '', location: '', charge: 0 }],
  drop_time: [{ from: '', to: '', location: '', charge: 0 }],
  pickup_location_details: '',
  dropoff_location_details: '',
  tags: [],
  location: [],
  category: [],
  duration: '',
  booking_enabled: 1,
  status: '',
})

const tourTypes = ref([])
const transportTypes = ref([])
const guideLanguages = ref([])
const currencies = ref([])

const handleMerchantUserChange = (merchantId, userId) => {
  formData.value.merchant_id = merchantId
  formData.value.user_id = userId
  console.log('Merchant ID:', merchantId, 'User ID:', userId)
}

// const handleLocationChange = (locationData) => {
//   formData.value.location = locationData
//     ? [{ id: locationData.location_id, name: locationData.location_name }]
//     : []
// }

// const handleCategoryChange = (category) => {
//   formData.value.category = category
// }

// const handleTagsChange = (tags) => {
//   formData.value.tags = tags
// }

const addMetaField = () => {
  formData.value.tour_meta.push({ key: '', value: '' })
}

const removeMetaField = (index) => {
  formData.value.tour_meta.splice(index, 1)
}

const addAvailableDate = () => {
  formData.value.available_dates.push({ from: '', to: '' })
}

const removeAvailableDate = (index) => {
  formData.value.available_dates.splice(index, 1)
}

const addPickUpLocation = () => {
  formData.value.pick_up_time.push({ from: '', to: '', location: '', charge: 0 })
}

const removePickUpLocation = (index) => {
  formData.value.pick_up_time.splice(index, 1)
}

const addDropLocation = () => {
  formData.value.drop_time.push({ from: '', to: '', location: '', charge: 0 })
}

const removeDropLocation = (index) => {
  formData.value.drop_time.splice(index, 1)
}

const addDiscount = (target) => {
  formData.value.discount.push({ name: '', type: '', amount: 0, target })
}

const removeDiscount = (index) => {
  formData.value.discount.splice(index, 1)
}

const toggleParkFee = (target) => {
  formData.value[target].include_park_fee = !formData.value[target].include_park_fee
}

const clearForm = () => {
  formData.value = {
    merchant_id: '',
    user_id: userId,
    tour_name: '',
    subheading: '',
    description: '',
    itinerary: '',
    tour_start_time: '',
    tour_end_time: '',
    regular_price_adult: 0,
    net_price_adult: { amount: 0, include_park_fee: true },
    local_net_price_adult: { amount: 0, include_park_fee: true },
    regular_price_child: 0,
    net_price_child: { amount: 0, include_park_fee: true },
    local_net_price_child: { amount: 0, include_park_fee: true },
    park_fee: {
      price_child_park_fee: 0,
      price_adult_park_fee: 0,
      local_price_adult_park_fee: 0,
      local_price_child_park_fee: 0,
    },
    discount: [], // Initialize as an empty array
    available_dates: {
      from: '',
      to: '',
    },
    available_seat: 0,
    total_seat: 0,
    image_gallery: [],
    video_gallery: [],
    thumbnail: '',
    transport_types: '',
    languages_supported: [],
    highlights: '',
    min_age: 0,
    max_age: 0,
    cancellation_policy: '',
    discount_percentage: 0,
    tour_type: '',
    currency: [],
    status: 'draft',
    tour_meta: [],
    pick_up_time: [{ from: '', to: '', location: '', charge: 0 }],
    drop_time: [{ from: '', to: '', location: '', charge: 0 }],
    pickup_location_details: '',
    dropoff_location_details: '',
    duration: '',
  }
}

const parseJsonField = (field) => {
  try {
    return typeof field === 'string' ? JSON.parse(field) : field
  } catch (error) {
    console.error('Failed to parse JSON field:', error)
    return []
  }
}

const loadTourDetails = async () => {
  try {
    const tourId = route.params.id
    if (!tourId) {
      throw new Error('Tour ID is missing')
    }
    console.log('Tour ID:', tourId)

    const tourDetails = await editTourStore.fetchTourDetails(tourId)
    if (!tourDetails) {
      throw new Error('Failed to fetch tour details')
    }

    formData.value = { ...formData.value, ...tourDetails }
    // Ensure select dropdowns are updated with existing data
    formData.value.languages_supported = parseJsonField(tourDetails.languages_supported)
    formData.value.currency = parseJsonField(tourDetails.currency)
    formData.value.tour_name = tourDetails.tour_name || ''
    formData.value.subheading = tourDetails.subheading || ''
    formData.value.highlights = tourDetails.highlights || ''
    formData.value.cancellation_policy = tourDetails.cancellation_policy || ''
    formData.value.discount = parseJsonField(tourDetails.discount)
    formData.value.park_fee = parseJsonField(tourDetails.park_fee)
    formData.value.pick_up_time = parseJsonField(tourDetails.pick_up_time)
    formData.value.available_dates = parseJsonField(tourDetails.available_dates)
    formData.value.drop_time = parseJsonField(tourDetails.drop_time)
    formData.value.tour_meta = parseJsonField(tourDetails.tour_meta)
    formData.value.available_days = parseJsonField(tourDetails.available_days)
    formData.value.status = tourDetails.status
    formData.value.tour_type = tourDetails.tour_type || ''
    formData.value.transport_types = tourDetails.transport_types
    formData.value.merchant_id = tourDetails.merchant_id || ''
    formData.value.user_id = tourDetails.user_id || ''
    formData.value.location = parseJsonField(tourDetails.location)
    formData.value.category = parseJsonField(tourDetails.category)
    formData.value.tags = parseJsonField(tourDetails.tags)

    console.log(formData.value.location)

    // Initialize select2 with existing data
    setTimeout(() => {
      $('#language')
        .val(
          formData.value.languages_supported?.map(
            (lang) => lang?.charAt(0).toUpperCase() + lang?.slice(1).toLowerCase(),
          ),
        )
        .trigger('change')
      $('#currency')
        .val(
          formData.value.currency?.map(
            (curr) => curr?.charAt(0).toUpperCase() + curr?.slice(1).toLowerCase(),
          ),
        )
        .trigger('change')
      $('#tour-type')
        .val(
          formData.value.tour_type?.charAt(0).toUpperCase() +
            formData.value.tour_type?.slice(1).toLowerCase(),
        )
        .trigger('change')
      $('#transport-type')
        .val(
          formData.value.transport_types?.charAt(0).toUpperCase() +
            formData.value.transport_types?.slice(1).toLowerCase(),
        )
        .trigger('change')
      $('#status-org')
        .val(formData.value.status?.charAt(0).toUpperCase() + formData.value.status?.slice(1))
        .trigger('change')
      $('#location')
        .val(formData.value.location?.charAt(0).toUpperCase() + formData.value.location?.slice(1))
        .trigger('change')
    }, 0)
  } catch (error) {
    toast.error('Failed to load tour details: ' + error.message)
  }
}

const handleSubmit = async () => {
  try {
    const tourId = route.params.id
    if (!tourId) {
      throw new Error('Tour ID is missing')
    }
    await editTourStore.updateTourDetails(tourId, formData.value)
    toast.success('Tour updated successfully!', {
      position: 'top-right',
      duration: 5000,
    })
    clearForm()
    router.push('/all-tours')
  } catch (error) {
    console.log('Failed to update tour: ' + error.message)
  }
}

const handleThumbnailUpload = async (file) => {
  try {
    const url = await DragAndDropUpload(file, formData.value, null, toast, 'thumbnail')
    formData.value.thumbnail = url.url
    // toast.success('Thumbnail uploaded successfully')
  } catch (error) {
    toast.error('Failed to upload thumbnail', error)
  }
}

const handleImageGalleryUpload = async (files) => {
  console.log('Files:', files)

  try {
    for (const file of files) {
      const thumbnail = await DragAndDropUpload(file, formData.value, null, toast, 'image_gallery')
      // console.log('URL:', url)

      formData.value.image_gallery.push(thumbnail.url)
    }
    // toast.success('Images uploaded successfully')
  } catch (error) {
    console.log('Error:', error)

    // toast.error('Failed to upload images...', error)
  }
}

const handleVideoGalleryUpload = async (videoFiles) => {
  console.log('Video Files:', videoFiles)

  try {
    for (const file of videoFiles) {
      const video = await DragAndDropUpload(file, formData.value, null, toast, 'video_gallery')
      formData.value.video_gallery.push(video.url)
      console.log('success in')
    }
  } catch (error) {
    console.error(error)
    // toast.error('Failed to upload videos', error)
  }
}

onMounted(async () => {
  // console.log('Route params:', route.params)
  initializeAddTour()
  await loadTourDetails()

  // Initialize Quill editor for itinerary
  const itineraryEditor = new Quill('.tour-itinerary', {
    modules: {
      toolbar: '.itinerary-toolbar',
    },
    placeholder: 'Tour Itinerary',
    theme: 'snow',
  })

  // Set initial content for itinerary editor
  itineraryEditor.root.innerHTML = formData.value.itinerary

  // Update formData.itinerary on editor change
  itineraryEditor.on('text-change', () => {
    formData.value.itinerary = itineraryEditor.root.innerHTML
  })

  // Initialize Quill editor for description
  const descriptionEditor = new Quill('.tour-description-editor', {
    modules: {
      toolbar: '.description-toolbar',
    },
    placeholder: 'Tour Description',
    theme: 'snow',
  })

  // Set initial content for description editor
  descriptionEditor.root.innerHTML = formData.value.description

  // Update formData.description on editor change
  descriptionEditor.on('text-change', () => {
    formData.value.description = descriptionEditor.root.innerHTML
  })

  // Initialize Dropzones
  initializeDropzone('#thumbnail', handleThumbnailUpload, formData.value, toast)
  initializeDropzone('#image_gallery', handleImageGalleryUpload, formData.value, toast, true)
  initializeDropzone('#video_gallery', handleVideoGalleryUpload, formData.value, toast, true)

  // console.log(formData.value.status)

  try {
    const response = await import('../../utils/json/tourTypes.json')
    tourTypes.value = response.default
    // console.log(tourTypes.value)
  } catch (error) {
    console.error('Failed to load tour types:', error)
  }

  try {
    const response = await import('../../utils/json/transportTypes.json')
    transportTypes.value = response.default
  } catch (error) {
    console.error('Failed to load transport types:', error)
  }

  try {
    const response = await import('../../utils/json/guideLanguages.json')
    guideLanguages.value = response.default
  } catch (error) {
    console.error('Failed to load guide languages:', error)
  }

  try {
    const response = await import('../../utils/json/currencies.json')
    currencies.value = response.default
  } catch (error) {
    console.error('Failed to load currencies:', error)
  }
})
</script>

<template>
  <div class="app-ecommerce">
    <!-- Add Product -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Edit Tour</h4>
        <p class="mb-0">Orders placed across your store</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button class="btn btn-label-secondary">View Tour</button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary" @click="handleSubmit">Update Tour</button>
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
                placeholder="Tour title"
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
              <div class="form-control p-0">
                <div class="description-toolbar border-0 border-bottom">
                  <div class="d-flex justify-content-start">
                    <span class="ql-formats me-0">
                      <button class="ql-bold"></button>
                      <button class="ql-italic"></button>
                      <button class="ql-underline"></button>
                      <button class="ql-list" value="ordered"></button>
                      <button class="ql-list" value="bullet"></button>
                      <button class="ql-link"></button>
                      <button class="ql-image"></button>
                    </span>
                  </div>
                </div>
                <div class="tour-description-editor border-0 pb-6"></div>
              </div>
            </div>
            <div class="mt-5">
              <label class="mb-1">Itinerary (Optional)</label>
              <div class="form-control p-0">
                <div class="itinerary-toolbar border-0 border-bottom">
                  <div class="d-flex justify-content-start">
                    <span class="ql-formats me-0">
                      <button class="ql-bold"></button>
                      <button class="ql-italic"></button>
                      <button class="ql-underline"></button>
                      <button class="ql-list" value="ordered"></button>
                      <button class="ql-list" value="bullet"></button>
                      <button class="ql-link"></button>
                      <button class="ql-image"></button>
                    </span>
                  </div>
                </div>
                <div class="tour-itinerary border-0 pb-6"></div>
              </div>
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
                      <div class="input-group">
                        <input
                          type="number"
                          class="form-control"
                          id="adult-net-price"
                          placeholder="Net Price"
                          v-model="formData.net_price_adult"
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="toggleParkFee('net_price_adult')"
                        >
                          {{
                            formData.net_price_adult.include_park_fee
                              ? 'Include Park Fee'
                              : 'Exclude Park Fee'
                          }}
                        </button>
                      </div>
                      <div v-if="!formData.net_price_adult.include_park_fee" class="mt-2">
                        <label class="form-label" for="adult-park-fee">National Park fee</label>
                        <input
                          type="number"
                          class="form-control"
                          id="adult-park-fee"
                          placeholder="Enter Park Fee"
                          v-model="formData.park_fee.price_adult_park_fee"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="local-adult-net-price"
                        >Local Net Price(Thai People)</label
                      >
                      <div class="input-group">
                        <input
                          type="number"
                          class="form-control"
                          id="local-adult-net-price"
                          placeholder="Local Net Price"
                          v-model="formData.local_net_price_adult"
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="toggleParkFee('local_net_price_adult')"
                        >
                          {{
                            formData.local_net_price_adult.include_park_fee
                              ? 'Include Park Fee'
                              : 'Exclude Park Fee'
                          }}
                        </button>
                      </div>
                      <div v-if="!formData.local_net_price_adult.include_park_fee" class="mt-2">
                        <label class="form-label" for="local-adult-park-fee"
                          >National Park fee</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          id="local-adult-park-fee"
                          placeholder="Enter Park Fee"
                          v-model="formData.park_fee.local_price_adult_park_fee"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="adult-discount">Discount</label>
                      <br />
                      <div
                        v-for="(discount, index) in formData.discount.filter(
                          (d) => d.target === 'adult',
                        )"
                        :key="index"
                        class="row mb-3"
                      >
                        <div class="col-4">
                          <input
                            type="text"
                            class="form-control"
                            v-model="discount.name"
                            placeholder="Discount Name"
                          />
                        </div>
                        <div class="col-4">
                          <select class="form-control" v-model="discount.type">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div class="col-3">
                          <input
                            type="number"
                            class="form-control"
                            v-model="discount.amount"
                            placeholder="Amount"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div class="col-1 d-flex align-items-end">
                          <button
                            type="button"
                            class="btn btn-danger"
                            @click="removeDiscount(index)"
                          >
                            x
                          </button>
                        </div>
                      </div>
                      <button type="button" class="btn btn-primary" @click="addDiscount('adult')">
                        <i class="ti ti-plus ti-xs me-2"></i>
                        Add Discount
                      </button>
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
                      <div class="input-group">
                        <input
                          type="number"
                          class="form-control"
                          id="child-net-price"
                          placeholder="Net Price"
                          v-model="formData.net_price_child"
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="toggleParkFee('net_price_child')"
                        >
                          {{
                            formData.net_price_child.include_park_fee
                              ? 'Include Park Fee'
                              : 'Exclude Park Fee'
                          }}
                        </button>
                      </div>
                      <div v-if="!formData.net_price_child.include_park_fee" class="mt-2">
                        <label class="form-label" for="child-park-fee">National Park fee</label>
                        <input
                          type="number"
                          class="form-control"
                          id="child-park-fee"
                          placeholder="Enter Park Fee"
                          v-model="formData.park_fee.price_child_park_fee"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="local-child-net-price"
                        >Local Net Price (For Thai People)</label
                      >
                      <div class="input-group">
                        <input
                          type="number"
                          class="form-control"
                          id="local-child-net-price"
                          placeholder="Net Price"
                          v-model="formData.local_net_price_child"
                          min="0"
                          step="0.01"
                        />
                        <button
                          type="button"
                          class="btn btn-outline-secondary"
                          @click="toggleParkFee('local_net_price_child')"
                        >
                          {{
                            formData.local_net_price_child.include_park_fee
                              ? 'Include Park Fee'
                              : 'Exclude Park Fee'
                          }}
                        </button>
                      </div>
                      <div v-if="!formData.local_net_price_child.include_park_fee" class="mt-2">
                        <label class="form-label" for="local-child-park-fee"
                          >National Park fee</label
                        >
                        <input
                          type="number"
                          class="form-control"
                          id="local-child-park-fee"
                          placeholder="Enter Park Fee"
                          v-model="formData.park_fee.local_price_child_park_fee"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-discount">Discount</label>
                      <br />
                      <div
                        v-for="(discount, index) in formData.discount.filter(
                          (d) => d.target === 'child',
                        )"
                        :key="index"
                        class="row mb-3"
                      >
                        <div class="col-4">
                          <input
                            type="text"
                            class="form-control"
                            v-model="discount.name"
                            placeholder="Discount Name"
                          />
                        </div>
                        <div class="col-4">
                          <select class="form-control" v-model="discount.type">
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                          </select>
                        </div>
                        <div class="col-3">
                          <input
                            type="number"
                            class="form-control"
                            v-model="discount.amount"
                            placeholder="Amount"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div class="col-1 d-flex align-items-end">
                          <button
                            type="button"
                            class="btn btn-danger"
                            @click="removeDiscount(index)"
                          >
                            x
                          </button>
                        </div>
                      </div>
                      <button type="button" class="btn btn-primary" @click="addDiscount('child')">
                        <i class="ti ti-plus ti-xs me-2"></i>
                        Add Discount
                      </button>
                    </div>
                  </div>
                  <div class="tab-pane fade" id="age_rules" role="tabpanel">
                    <h6 class="mb3 text-body">Age Policy</h6>
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
                <div class="tab-content p-0 mt-4">
                  <!-- photoGallery Tab -->
                  <div class="tab-pane fade show active" id="photoGallery" role="tabpanel">
                    <h6 class="text-body">You Can Upload multiple Photos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <div class="dropzone needsclick p-0" id="image_gallery">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your images here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse images</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="image_gallery" type="file" multiple />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Child Price Tab -->
                  <div class="tab-pane fade" id="videoGallery" role="tabpanel">
                    <h6 class="mb-3 text-body">You can upload multiple videos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <div class="dropzone needsclick p-0" id="video_gallery">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your videos here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse videos</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="video_gallery" type="file" multiple />
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
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#pickupTime">
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
                <div class="tab-content p-0 mt-4">
                  <!-- Pickup Time Tab -->
                  <div class="tab-pane fade show active" id="tour_schedule" role="tabpanel">
                    <h6 class="text-body">Tour Start end time</h6>
                    <div class="mb-3">
                      <label class="form-label">Tour Start Time</label>
                      <input
                        type="time"
                        class="form-control"
                        id="TourScheduleStarTime"
                        v-model="formData.tour_start_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">End TIme</label>
                      <input
                        type="time"
                        class="form-control"
                        id="TourScheduleEndTime"
                        v-model="formData.tour_end_time"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Tour Duration</label>
                      <input
                        type="number"
                        class="form-control"
                        id="TourDuration"
                        v-model="formData.duration"
                      />
                    </div>
                  </div>
                  <div class="tab-pane fade" id="pickupTime" role="tabpanel">
                    <h6 class="text-body">Tour Pickup Time Range</h6>
                    <div
                      v-for="(time, index) in formData.pick_up_time"
                      :key="index"
                      class="row mb-4"
                    >
                      <div class="col-md-3">
                        <label class="form-label">From</label>
                        <input type="time" class="form-control" v-model="time.from" />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">To</label>
                        <input type="time" class="form-control" v-model="time.to" />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Location</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="time.location"
                          placeholder="Location"
                        />
                      </div>
                      <div class="col-md-2">
                        <label class="form-label">Charge</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="time.charge"
                          placeholder="Charge"
                        />
                      </div>
                      <div class="col-md-1 d-flex align-items-end">
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="removePickUpLocation(index)"
                        >
                          x
                        </button>
                      </div>
                    </div>
                    <button type="button" class="btn btn-primary" @click="addPickUpLocation">
                      <i class="ti ti-plus ti-xs me-2"></i>
                      Add Pickup Location
                    </button>
                    <div class="mb-3">
                      <label class="form-label">Pickup Location Details</label>
                      <textarea
                        class="form-control"
                        v-model="formData.pickup_location_details"
                        placeholder="Enter pickup location details"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                  <!-- Drop-off Time Tab -->
                  <div class="tab-pane fade" id="dropoffTime" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Drop-off Time Range</h6>
                    <div v-for="(time, index) in formData.drop_time" :key="index" class="row mb-4">
                      <div class="col-md-3">
                        <label class="form-label">From</label>
                        <input type="time" class="form-control" v-model="time.from" />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">To</label>
                        <input type="time" class="form-control" v-model="time.to" />
                      </div>
                      <div class="col-md-3">
                        <label class="form-label">Location</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="time.location"
                          placeholder="Location"
                        />
                      </div>
                      <div class="col-md-2">
                        <label class="form-label">Charge</label>
                        <input
                          type="number"
                          class="form-control"
                          v-model="time.charge"
                          placeholder="Charge"
                        />
                      </div>
                      <div class="col-md-1 d-flex align-items-end">
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="removeDropLocation(index)"
                        >
                          x
                        </button>
                      </div>
                    </div>
                    <button type="button" class="btn btn-primary" @click="addDropLocation">
                      <i class="ti ti-plus ti-xs me-2"></i>
                      Add Drop Location
                    </button>
                    <div class="mb-3">
                      <label class="form-label">Drop Location Details</label>
                      <textarea
                        class="form-control"
                        v-model="formData.dropoff_location_details"
                        placeholder="Enter Drop location details"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                  <!-- Tour Dates Tab -->
                  <div class="tab-pane fade" id="tourDates" role="tabpanel">
                    <h6 class="mb3 text-body">Tour Availability</h6>
                    <div
                      v-for="(date, index) in formData.available_dates"
                      :key="index"
                      class="row mb-4"
                    >
                      <div class="col-md-5">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" v-model="date.from" />
                      </div>
                      <div class="col-md-5">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" v-model="date.to" />
                      </div>
                      <div class="col-md-2">
                        <label class="form-label"> </label>
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="removeAvailableDate(index)"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <button type="button" class="btn btn-primary" @click="addAvailableDate">
                      Add Available Date
                    </button>
                    <div class="mb-4">
                      <label class="form-label">Operating Days</label>
                      <div class="d-flex flex-wrap gap-2">
                        <div
                          class="form-check"
                          v-for="(day, index) in formData.available_days"
                          :key="index"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="day.day"
                            v-model="day.checked"
                          />
                          <label class="form-check-label" :for="day.day">{{ day.day }}</label>
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
            data-placeholder="Select Status"
            v-model="formData.status"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
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
                  <input
                    type="checkbox"
                    class="form-check-input"
                    v-model="formData.booking_enabled"
                  />
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
            <option v-for="type in tourTypes" :key="type.value" :value="type.value">
              {{ type.value }}
            </option>
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
            <option
              v-for="transport in transportTypes"
              :key="transport.value"
              :value="transport.value"
            >
              {{ transport.label }}
            </option>
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
            <option
              v-for="language in guideLanguages"
              :key="language.value"
              :value="language.value"
            >
              {{ language.label }}
            </option>
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
            <option v-for="currency in currencies" :key="currency.value" :value="currency.value">
              {{ currency.label }}
            </option>
          </select>
        </div>

        <!-- Organize Card -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Organize</h5>
          </div>
          <div class="card-body">
            <MerchantUsers
              :selectedMerchantId="formData.merchant_id"
              :selectedUserId="formData.user_id"
              @merchant-user-change="handleMerchantUserChange"
            />
            <TourLocation />
            <TourCategory :selectedCategory="formData.category" />
            <TourTags :selectedTags="formData.tags" />
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
