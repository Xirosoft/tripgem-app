<script>
import { Modal } from 'bootstrap'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewTourStore } from '../../stores/tour/ViewTour.js'

export default {
  setup() {
    const route = useRoute()
    const store = useViewTourStore()
    const tourDetails = ref(null)
    const modalRef = ref(null)
    const modalInstance = ref(null)

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
      // Ensure park_fee is an object
      if (typeof tourDetails.value.park_fee === 'string') {
        tourDetails.value.park_fee = JSON.parse(tourDetails.value.park_fee)
      }
      // Ensure tour_meta is an array
      if (typeof tourDetails.value.tour_meta === 'string') {
        tourDetails.value.tour_meta = JSON.parse(tourDetails.value.tour_meta)
      }
      // Ensure pick_up_time is an array
      if (typeof tourDetails.value.pick_up_time === 'string') {
        tourDetails.value.pick_up_time = JSON.parse(tourDetails.value.pick_up_time)
      }
      // Ensure drop_time is an array
      if (typeof tourDetails.value.drop_time === 'string') {
        tourDetails.value.drop_time = JSON.parse(tourDetails.value.drop_time)
      }
      // Ensure available_dates is an array
      if (typeof tourDetails.value.available_dates === 'string') {
        tourDetails.value.available_dates = JSON.parse(tourDetails.value.available_dates)
      }
      // Ensure available_days is an array
      if (typeof tourDetails.value.available_days === 'string') {
        tourDetails.value.available_days = JSON.parse(tourDetails.value.available_days)
      }
      // Ensure tags is an array
      if (typeof tourDetails.value.tags === 'string') {
        tourDetails.value.tags = JSON.parse(tourDetails.value.tags)
      }
      // Ensure location is an array
      if (typeof tourDetails.value.location === 'string') {
        tourDetails.value.location = JSON.parse(tourDetails.value.location)
      }
      // Ensure category is an array
      if (typeof tourDetails.value.category === 'string') {
        tourDetails.value.category = JSON.parse(tourDetails.value.category)
      }
    })

    const openModal = (url, type) => {
      modalInstance.value = new Modal(modalRef.value)
      modalRef.value.querySelector('.modal-body').innerHTML =
        type === 'image'
          ? `<img src="${url}" class="w-100" alt="Gallery Image"/>`
          : `<video class="w-100" controls><source src="${url}" type="video/mp4"/></video>`
      modalInstance.value.show()
    }

    return {
      tourDetails,
      modalRef,
      openModal,
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
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  class="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img :src="tourDetails.thumbnail" class="d-block w-100" alt="Tour Thumbnail" />
                </div>
                <div
                  v-for="image in tourDetails.image_gallery"
                  :key="image.url"
                  class="carousel-item"
                >
                  <img
                    :src="image.url"
                    class="d-block w-100"
                    alt="Tour Image"
                    @click="openModal(image.url, 'image')"
                  />
                </div>
                <div
                  v-for="video in tourDetails.video_gallery"
                  :key="video.url"
                  class="carousel-item"
                >
                  <video class="d-block w-100" controls @click="openModal(video.url, 'video')">
                    <source :src="video.url" type="video/mp4" />
                  </video>
                </div>
              </div>
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev"
              >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
            <div class="card-body pt-4">
              <h5>About this tour</h5>
              <p class="mb-0">{{ tourDetails.description }}</p>
              <hr class="my-6" />
              <h5>Itinerary</h5>
              <p class="mb-0">{{ tourDetails.itinerary }}</p>
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
                <span v-for="tag in tourDetails.tags" :key="tag.id"> {{ tag.tag_name }}, </span>
              </p>
              <p>
                <strong>Location:</strong>
                <span v-for="loc in tourDetails.location" :key="loc.id">
                  {{ loc.name }}
                </span>
              </p>
              <p>
                <strong>Category:</strong>
                <span v-for="cat in tourDetails.category" :key="cat.id">{{
                  cat.category_name
                }}</span>
              </p>
              <p><strong>Duration:</strong> {{ tourDetails.duration }} hours</p>
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
                <p>
                  <strong>Booking Enabled:</strong> {{ tourDetails.booking_enabled ? 'Yes' : 'No' }}
                </p>
                <p><strong>Status:</strong> {{ tourDetails.status }}</p>
                <p><strong>Created At:</strong> {{ tourDetails.created_at }}</p>
                <p><strong>Updated At:</strong> {{ tourDetails.updated_at }}</p>
                <p><strong>Park Fee:</strong></p>
                <ul>
                  <li>Child Park Fee: {{ tourDetails.park_fee.price_child_park_fee }}</li>
                  <li>Adult Park Fee: {{ tourDetails.park_fee.price_adult_park_fee }}</li>
                  <li>
                    Local Adult Park Fee: {{ tourDetails.park_fee.local_price_adult_park_fee }}
                  </li>
                  <li>
                    Local Child Park Fee: {{ tourDetails.park_fee.local_price_child_park_fee }}
                  </li>
                </ul>
                <p><strong>Merchant ID:</strong> {{ tourDetails.merchant_id }}</p>
                <p><strong>User ID:</strong> {{ tourDetails.user_id }}</p>
                <p><strong>Min Age:</strong> {{ tourDetails.min_age }}</p>
                <p><strong>Max Age:</strong> {{ tourDetails.max_age }}</p>
                <p><strong>Discount Percentage:</strong> {{ tourDetails.discount_percentage }}%</p>

                <p>
                  <strong>Discounts:</strong>
                  <span v-for="discount in tourDetails.discount" :key="discount.name"
                    >{{ discount.name }} - {{ discount.amount }}</span
                  >
                </p>
                <p>
                  <strong>Available Dates:</strong>
                  <span v-for="date in tourDetails.available_dates" :key="date.from">
                    {{ date.from }} to {{ date.to }}
                  </span>
                </p>
                <p>
                  <strong>Available Days:</strong>
                  <span v-for="day in tourDetails.available_days" :key="day.day">
                    {{ day.day }} ({{ day.checked ? 'Available' : 'Not Available' }})
                  </span>
                </p>
                <p>
                  <strong>Tour Meta:</strong>
                  <span v-for="meta in tourDetails.tour_meta" :key="meta.key">
                    {{ meta.key }}: {{ meta.value }}
                  </span>
                </p>
                <p>
                  <strong>Pick Up Time:</strong>
                  <span v-for="pickup in tourDetails.pick_up_time" :key="pickup.from">
                    {{ pickup.from }} to {{ pickup.to }} at {{ pickup.location }} (Charge:
                    {{ pickup.charge }})
                  </span>
                </p>
                <p>
                  <strong>Drop Time:</strong>
                  <span v-for="drop in tourDetails.drop_time" :key="drop.from">
                    {{ drop.from }} to {{ drop.to }} at {{ drop.location }} (Charge:
                    {{ drop.charge }})
                  </span>
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

  <!-- Modal -->
  <div
    class="modal fade"
    ref="modalRef"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Gallery</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- Content will be injected here -->
        </div>
      </div>
    </div>
  </div>
  <!-- / Content -->
</template>

<style scoped>
.carousel-item img,
.carousel-item video {
  cursor: pointer;
}
</style>
