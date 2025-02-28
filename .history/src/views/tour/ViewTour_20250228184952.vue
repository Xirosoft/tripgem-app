<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewTourStore } from '../../stores/tour/ViewTour.js'

export default {
  setup() {
    const route = useRoute()
    const store = useViewTourStore()
    const tourDetails = ref(null)

    onMounted(async () => {
      await store.fetchTourDetails(route.params.id)
      tourDetails.value = store.tourDetails

      // Ensure languages_supported is an array
      if (typeof tourDetails.value.languages_supported === 'string') {
        tourDetails.value.languages_supported = JSON.parse(tourDetails.value.languages_supported)
      }
      // Ensure image_gallery is an array
      if (typeof tourDetails.value.image_gallery === 'string') {
        tourDetails.value.image_gallery = JSON.parse(tourDetails.value.image_gallery)
      }
      // Ensure video_gallery is an array
      if (typeof tourDetails.value.video_gallery === 'string') {
        tourDetails.value.video_gallery = JSON.parse(tourDetails.value.video_gallery)
      }
      // Ensure currency is an array
      if (typeof tourDetails.value.currency === 'string') {
        tourDetails.value.currency = JSON.parse(tourDetails.value.currency)
      }
    })

    return {
      tourDetails,
    }
  },
}
</script>

<template>
  <!-- Content -->
  <div class="container-xxl flex-grow-1 container-p-y" v-if="tourDetails">
    <div class="row g-6">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center flex-wrap mb-6 gap-2">
              <div class="me-1">
                <h5 class="mb-0">{{ tourDetails.tour_name }}</h5>
                <p class="mb-0">
                  <span class="fw-medium text-heading">{{ tourDetails.subheading }}</span>
                </p>
              </div>
              <div class="d-flex align-items-center">
                <span class="badge bg-label-danger">{{ tourDetails.tour_type }}</span>
                <i class="ti ti-share ti-lg mx-4"></i>
                <i class="ti ti-bookmarks ti-lg"></i>
              </div>
            </div>
            <div class="card academy-content shadow-none border">
              <div class="p-2">
                <div class="cursor-pointer">
                  <img :src="tourDetails.thumbnail" class="w-100" alt="Tour Thumbnail" />
                </div>
              </div>
              <div class="card-body pt-4">
                <h5>About this tour</h5>
                <p class="mb-0">{{ tourDetails.description }}</p>
                <hr class="my-6" />
                <h5>Itinerary</h5>
                <p class="mb-0">{{ tourDetails.itinerary }}</p>
                <hr class="my-6" />
                <h5>Gallery</h5>
                <div v-if="tourDetails.image_gallery.length">
                  <div v-for="image in tourDetails.image_gallery" :key="image.url">
                    <img :src="image.url" class="w-100 mb-2" alt="Tour Image" />
                  </div>
                </div>
                <div v-if="tourDetails.video_gallery.length">
                  <div v-for="video in tourDetails.video_gallery" :key="video.url">
                    <video class="w-100 mb-2" controls>
                      <source :src="video.url" type="video/mp4" />
                    </video>
                  </div>
                </div>
                <hr class="my-6" />
                <h5>Details</h5>
                <p><strong>Start Time:</strong> {{ tourDetails.tour_start_time }}</p>
                <p><strong>End Time:</strong> {{ tourDetails.tour_end_time }}</p>
                <p><strong>Price (Adult):</strong> {{ tourDetails.regular_price_adult }}</p>
                <p><strong>Price (Child):</strong> {{ tourDetails.regular_price_child }}</p>
                <p><strong>Available Seats:</strong> {{ tourDetails.available_seat }}</p>
                <p><strong>Total Seats:</strong> {{ tourDetails.total_seat }}</p>
                <p>
                  <strong>Languages Supported:</strong>
                  {{ tourDetails.languages_supported.join(', ') }}
                </p>
                <p><strong>Highlights:</strong> {{ tourDetails.highlights }}</p>
                <p><strong>Cancellation Policy:</strong> {{ tourDetails.cancellation_policy }}</p>
                <p><strong>Transport Types:</strong> {{ tourDetails.transport_types }}</p>
                <p><strong>Currency:</strong> {{ tourDetails.currency.join(', ') }}</p>
                <p>
                  <strong>Tags:</strong>
                  <span v-for="tag in tourDetails.tags" :key="tag.id">{{ tag.tag_name }}</span>
                </p>
                <p>
                  <strong>Location:</strong>
                  <span v-for="loc in tourDetails.location" :key="loc.id">{{ loc.name }}</span>
                </p>
                <p>
                  <strong>Category:</strong>
                  <span v-for="cat in tourDetails.category" :key="cat.id">{{
                    cat.category_name
                  }}</span>
                </p>
                <p><strong>Duration:</strong> {{ tourDetails.duration }} hours</p>
                <p>
                  <strong>Booking Enabled:</strong> {{ tourDetails.booking_enabled ? 'Yes' : 'No' }}
                </p>
                <p><strong>Status:</strong> {{ tourDetails.status }}</p>
                <p><strong>Created At:</strong> {{ tourDetails.created_at }}</p>
                <p><strong>Updated At:</strong> {{ tourDetails.updated_at }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="accordion stick-top accordion-custom-button" id="courseContent">
          <div class="accordion-item active mb-0">
            <div class="accordion-header" id="headingOne">
              <button
                type="button"
                class="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#chapterOne"
                aria-expanded="true"
                aria-controls="chapterOne"
              >
                <span class="d-flex flex-column">
                  <span class="h5 mb-0">Tour Details</span>
                </span>
              </button>
            </div>
            <div
              id="chapterOne"
              class="accordion-collapse collapse show"
              data-bs-parent="#courseContent"
            >
              <div class="accordion-body py-4">
                <p><strong>Merchant ID:</strong> {{ tourDetails.merchant_id }}</p>
                <p><strong>User ID:</strong> {{ tourDetails.user_id }}</p>
                <p><strong>Min Age:</strong> {{ tourDetails.min_age }}</p>
                <p><strong>Max Age:</strong> {{ tourDetails.max_age }}</p>
                <p><strong>Discount Percentage:</strong> {{ tourDetails.discount_percentage }}%</p>
                <p><strong>Park Fee:</strong> {{ tourDetails.park_fee }}</p>
                <p>
                  <strong>Discounts:</strong>
                  <span v-for="discount in tourDetails.discount" :key="discount.name"
                    >{{ discount.name }} - {{ discount.amount }}</span
                  >
                </p>
                <p>
                  <strong>Available Dates:</strong>
                  <span v-for="date in tourDetails.available_dates" :key="date.from"
                    >{{ date.from }} to {{ date.to }}</span
                  >
                </p>
                <p>
                  <strong>Available Days:</strong>
                  <span v-for="day in tourDetails.available_days" :key="day.day">{{
                    day.day
                  }}</span>
                </p>
                <p>
                  <strong>Tour Meta:</strong>
                  <span v-for="meta in tourDetails.tour_meta" :key="meta.key"
                    >{{ meta.key }}: {{ meta.value }}</span
                  >
                </p>
                <p>
                  <strong>Pick Up Time:</strong>
                  <span v-for="pickup in tourDetails.pick_up_time" :key="pickup.from"
                    >{{ pickup.from }} to {{ pickup.to }} at {{ pickup.location }} (Charge:
                    {{ pickup.charge }})</span
                  >
                </p>
                <p>
                  <strong>Drop Time:</strong>
                  <span v-for="drop in tourDetails.drop_time" :key="drop.from"
                    >{{ drop.from }} to {{ drop.to }} at {{ drop.location }} (Charge:
                    {{ drop.charge }})</span
                  >
                </p>
                <p>
                  <strong>Pickup Location Details:</strong>
                  {{ tourDetails.pickup_location_details }}
                </p>
                <p>
                  <strong>Dropoff Location Details:</strong>
                  {{ tourDetails.dropoff_location_details }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
  <!-- / Content -->
</template>

<style lang="less" scoped></style>
