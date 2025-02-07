<script setup>
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useToursStore } from '../../stores/tour/AddTour'

const toast = useToast()
const toursStore = useToursStore()

const formData = ref({
  merchant_id: 1,
  user_id: 11,
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
})

const submitForm = async () => {
  try {
    await toursStore.createTour(formData.value)
    toast.success('Tour added successfully')
  } catch (error) {
    toast.error('Failed to add tour', error)
  }
}

onMounted(() => {
  // Initialize any required components or data here
})
</script>

<template>
  <div class="app-ecommerce">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Add a new Tour</h4>
        <p class="mb-0">Fill in the details below to add a new tour</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <button type="submit" class="btn btn-primary" @click.prevent="submitForm">
          Publish Tour
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Information</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label" for="tour-name">Tour Name</label>
              <input
                v-model="formData.tour_name"
                type="text"
                class="form-control"
                id="tour-name"
                placeholder="Tour Name"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="subheading">Subheading</label>
              <input
                v-model="formData.subheading"
                type="text"
                class="form-control"
                id="subheading"
                placeholder="Subheading"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="description">Description</label>
              <textarea
                v-model="formData.description"
                class="form-control"
                id="description"
                placeholder="Description"
              ></textarea>
            </div>
            <div class="mb-6">
              <label class="form-label" for="itinerary">Itinerary</label>
              <textarea
                v-model="formData.itinerary"
                class="form-control"
                id="itinerary"
                placeholder="Itinerary"
              ></textarea>
            </div>
            <div class="row mb-6">
              <div class="col">
                <label class="form-label" for="tour-start-time">Start Time</label>
                <input
                  v-model="formData.tour_start_time"
                  type="time"
                  class="form-control"
                  id="tour-start-time"
                />
              </div>
              <div class="col">
                <label class="form-label" for="tour-end-time">End Time</label>
                <input
                  v-model="formData.tour_end_time"
                  type="time"
                  class="form-control"
                  id="tour-end-time"
                />
              </div>
            </div>
            <div class="row mb-6">
              <div class="col">
                <label class="form-label" for="regular-price-adult">Regular Price (Adult)</label>
                <input
                  v-model="formData.regular_price_adult"
                  type="number"
                  class="form-control"
                  id="regular-price-adult"
                />
              </div>
              <div class="col">
                <label class="form-label" for="net-price-adult">Net Price (Adult)</label>
                <input
                  v-model="formData.net_price_adult"
                  type="number"
                  class="form-control"
                  id="net-price-adult"
                />
              </div>
            </div>
            <div class="row mb-6">
              <div class="col">
                <label class="form-label" for="regular-price-child">Regular Price (Child)</label>
                <input
                  v-model="formData.regular_price_child"
                  type="number"
                  class="form-control"
                  id="regular-price-child"
                />
              </div>
              <div class="col">
                <label class="form-label" for="net-price-child">Net Price (Child)</label>
                <input
                  v-model="formData.net_price_child"
                  type="number"
                  class="form-control"
                  id="net-price-child"
                />
              </div>
            </div>
            <div class="mb-6">
              <label class="form-label" for="available-dates">Available Dates</label>
              <input
                v-model="formData.available_dates"
                type="text"
                class="form-control"
                id="available-dates"
                placeholder="YYYY-MM-DD,YYYY-MM-DD"
              />
            </div>
            <div class="row mb-6">
              <div class="col">
                <label class="form-label" for="available-seat">Available Seat</label>
                <input
                  v-model="formData.available_seat"
                  type="number"
                  class="form-control"
                  id="available-seat"
                />
              </div>
              <div class="col">
                <label class="form-label" for="total-seat">Total Seat</label>
                <input
                  v-model="formData.total_seat"
                  type="number"
                  class="form-control"
                  id="total-seat"
                />
              </div>
            </div>
            <div class="mb-6">
              <label class="form-label" for="thumbnail">Thumbnail</label>
              <input
                v-model="formData.thumbnail"
                type="text"
                class="form-control"
                id="thumbnail"
                placeholder="Thumbnail URL"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="transport-types">Transport Types</label>
              <input
                v-model="formData.transport_types"
                type="text"
                class="form-control"
                id="transport-types"
                placeholder="Transport Types"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="languages-supported">Languages Supported</label>
              <input
                v-model="formData.languages_supported"
                type="text"
                class="form-control"
                id="languages-supported"
                placeholder="Languages Supported"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="highlights">Highlights</label>
              <input
                v-model="formData.highlights"
                type="text"
                class="form-control"
                id="highlights"
                placeholder="Highlights"
              />
            </div>
            <div class="row mb-6">
              <div class="col">
                <label class="form-label" for="min-age">Min Age</label>
                <input v-model="formData.min_age" type="number" class="form-control" id="min-age" />
              </div>
              <div class="col">
                <label class="form-label" for="max-age">Max Age</label>
                <input v-model="formData.max_age" type="number" class="form-control" id="max-age" />
              </div>
            </div>
            <div class="mb-6">
              <label class="form-label" for="cancellation-policy">Cancellation Policy</label>
              <textarea
                v-model="formData.cancellation_policy"
                class="form-control"
                id="cancellation-policy"
                placeholder="Cancellation Policy"
              ></textarea>
            </div>
            <div class="mb-6">
              <label class="form-label" for="discount-percentage">Discount Percentage</label>
              <input
                v-model="formData.discount_percentage"
                type="number"
                class="form-control"
                id="discount-percentage"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="tour-type">Tour Type</label>
              <input
                v-model="formData.tour_type"
                type="text"
                class="form-control"
                id="tour-type"
                placeholder="Tour Type"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="currency">Currency</label>
              <input
                v-model="formData.currency"
                type="text"
                class="form-control"
                id="currency"
                placeholder="Currency"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="status">Status</label>
              <select v-model="formData.status" class="form-select" id="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any required styles here */
</style>
