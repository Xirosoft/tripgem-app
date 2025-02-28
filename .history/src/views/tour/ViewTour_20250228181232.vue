<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useViewTourStore } from '../../stores/tour/ViewTour.js'

export default {
  setup() {
    const route = useRoute()
    const store = useViewTourStore()
    const tourDetails = ref(null)
    console.log(route.params.id)

    onMounted(async () => {
      tourDetails.value = await store.fetchTourDetails(route.params.id)
      console.log(tourDetails.value)
    })

    return {
      tourDetails,
    }
  },
}
</script>

<template>
  <!-- Content -->
  <div v-if="tourDetails" class="container-xxl flex-grow-1 container-p-y">
    <div class="row g-6">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center flex-wrap mb-6 gap-2">
              <div class="me-1">
                <h5 class="mb-0">{{ tourDetails.tour_name }}</h5>
                <p class="mb-0">
                  Prof. <span class="fw-medium text-heading">{{ tourDetails.merchant_id }}</span>
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
                  <video
                    class="w-100"
                    poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                    id="plyr-video-player"
                    playsinline
                    controls
                  >
                    <source :src="tourDetails.video_gallery[0].url" type="video/mp4" />
                  </video>
                </div>
              </div>
              <div class="card-body pt-4">
                <h5>About this course</h5>
                <p class="mb-0">{{ tourDetails.description }}</p>
                <hr class="my-6" />
                <h5>By the numbers</h5>
                <div class="d-flex flex-wrap row-gap-2">
                  <div class="me-12">
                    <p class="text-nowrap mb-2">
                      <i class="ti ti-check me-2 align-bottom"></i>Skill level: All Levels
                    </p>
                    <p class="text-nowrap mb-2">
                      <i class="ti ti-users me-2 align-top"></i>Students: 38,815
                    </p>
                    <p class="text-nowrap mb-2">
                      <i class="ti ti-world me-2 align-bottom"></i>Languages:
                      {{ tourDetails.languages_supported.join(', ') }}
                    </p>
                    <p class="text-nowrap mb-0">
                      <i class="ti ti-file me-2 align-bottom"></i>Captions: Yes
                    </p>
                  </div>
                  <div>
                    <p class="text-nowrap mb-2">
                      <i class="ti ti-video me-2 align-top ms-50"></i>Lectures: 19
                    </p>
                    <p class="text-nowrap mb-0">
                      <i class="ti ti-clock me-2 align-top"></i>Video: 1.5 total hours
                    </p>
                  </div>
                </div>
                <hr class="my-6" />
                <h5>Description</h5>
                <p class="mb-6">{{ tourDetails.description }}</p>
                <hr class="my-6" />
                <h5>Instructor</h5>
                <div class="d-flex justify-content-start align-items-center user-name">
                  <div class="avatar-wrapper">
                    <div class="avatar me-4">
                      <img :src="tourDetails.thumbnail" alt="Avatar" class="rounded-circle" />
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <h6 class="mb-1">{{ tourDetails.merchant_id }}</h6>
                    <small>Web Developer, Designer, and Teacher</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <!-- Additional content can go here -->
      </div>
    </div>
  </div>
  <!-- / Content -->
</template>

<style lang="less" scoped></style>
