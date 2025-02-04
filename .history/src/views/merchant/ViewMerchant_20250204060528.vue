<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useViewMerchantsStore } from '../../stores/merchant/ViewMerchant.js'

const route = useRoute()
const store = useViewMerchantsStore()
const merchant = store.fetchMerchant(route.params.id)
</script>

<template>
  <div v-if="merchant">
    <!-- Header -->
    <div class="row">
      <div class="col-12">
        <div class="card mb-6">
          <div class="user-profile-header-banner">
            <img :src="merchant.logo_url" alt="Banner image" class="rounded-top" />
          </div>
          <div
            class="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5"
          >
            <div class="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
              <img
                :src="merchant.logo_url"
                alt="user image"
                class="d-block h-auto ms-0 ms-sm-6 rounded user-profile-img"
              />
            </div>
            <div class="flex-grow-1 mt-3 mt-lg-5">
              <div
                class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4"
              >
                <div class="user-profile-info">
                  <h4 class="mb-2 mt-lg-6">{{ merchant.company_name }}</h4>
                  <ul
                    class="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2"
                  >
                    <li class="list-inline-item d-flex gap-2 align-items-center">
                      <i class="ti ti-palette ti-lg"></i
                      ><span class="fw-medium">{{ merchant.business_type }}</span>
                    </li>
                    <li class="list-inline-item d-flex gap-2 align-items-center">
                      <i class="ti ti-map-pin ti-lg"></i
                      ><span class="fw-medium">{{ merchant.headquarters_location }}</span>
                    </li>
                    <li class="list-inline-item d-flex gap-2 align-items-center">
                      <i class="ti ti-calendar ti-lg"></i
                      ><span class="fw-medium"> Established {{ merchant.established_year }}</span>
                    </li>
                  </ul>
                </div>
                <a href="javascript:void(0)" class="btn btn-primary mb-1">
                  <i class="ti ti-user-check ti-xs me-2"></i>Connected
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/ Header -->

    <!-- Navbar pills -->
    <div class="row">
      <div class="col-md-12">
        <div class="nav-align-top">
          <ul class="nav nav-pills flex-column flex-sm-row mb-6 gap-2 gap-lg-0">
            <li class="nav-item">
              <a class="nav-link active" href="javascript:void(0);"
                ><i class="ti-sm ti ti-user-check me-1_5"></i> Profile</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="pages-profile-teams.html"
                ><i class="ti-sm ti ti-users me-1_5"></i> Teams</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="pages-profile-projects.html"
                ><i class="ti-sm ti ti-layout-grid me-1_5"></i> Projects</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="pages-profile-connections.html"
                ><i class="ti-sm ti ti-link me-1_5"></i> Connections</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--/ Navbar pills -->

    <!-- User Profile Content -->
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-5">
        <!-- About User -->
        <div class="card mb-6">
          <div class="card-body">
            <small class="card-text text-uppercase text-muted small">About</small>
            <ul class="list-unstyled my-3 py-1">
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-user ti-lg"></i><span class="fw-medium mx-2">Full Name:</span>
                <span>{{ merchant.contact_person_name }}</span>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-check ti-lg"></i><span class="fw-medium mx-2">Status:</span>
                <span>{{ merchant.status }}</span>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-crown ti-lg"></i><span class="fw-medium mx-2">Role:</span>
                <span>{{ merchant.position_designation }}</span>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-flag ti-lg"></i><span class="fw-medium mx-2">Country:</span>
                <span>{{ merchant.address.country }}</span>
              </li>
              <li class="d-flex align-items-center mb-2">
                <i class="ti ti-language ti-lg"></i><span class="fw-medium mx-2">Languages:</span>
                <span>{{ merchant.languages }}</span>
              </li>
            </ul>
            <small class="card-text text-uppercase text-muted small">Contacts</small>
            <ul class="list-unstyled my-3 py-1">
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-phone-call ti-lg"></i><span class="fw-medium mx-2">Contact:</span>
                <span>{{ merchant.phone_number }}</span>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-messages ti-lg"></i
                ><span class="fw-medium mx-2">Emergency Contact:</span>
                <span>{{ merchant.emergency_contact_number }}</span>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-mail ti-lg"></i><span class="fw-medium mx-2">Email:</span>
                <span>{{ merchant.email_address }}</span>
              </li>
            </ul>
            <small class="card-text text-uppercase text-muted small">Social Media</small>
            <ul class="list-unstyled my-3 py-1">
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-facebook ti-lg"></i><span class="fw-medium mx-2">Facebook:</span>
                <a :href="merchant.social_media_links.facebook" target="_blank">{{
                  merchant.social_media_links.facebook
                }}</a>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-twitter ti-lg"></i><span class="fw-medium mx-2">Twitter:</span>
                <a :href="merchant.social_media_links.twitter" target="_blank">{{
                  merchant.social_media_links.twitter
                }}</a>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-instagram ti-lg"></i><span class="fw-medium mx-2">Instagram:</span>
                <a :href="merchant.social_media_links.instagram" target="_blank">{{
                  merchant.social_media_links.instagram
                }}</a>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-youtube ti-lg"></i><span class="fw-medium mx-2">YouTube:</span>
                <a :href="merchant.social_media_links.youtube" target="_blank">{{
                  merchant.social_media_links.youtube
                }}</a>
              </li>
              <li class="d-flex align-items-center mb-4">
                <i class="ti ti-line ti-lg"></i><span class="fw-medium mx-2">Line:</span>
                <a :href="merchant.social_media_links.line" target="_blank">{{
                  merchant.social_media_links.line
                }}</a>
              </li>
            </ul>
          </div>
        </div>
        <!--/ About User -->
        <!-- Profile Overview -->
        <div class="card mb-6">
          <div class="card-body">
            <small class="card-text text-uppercase text-muted small">Overview</small>
            <ul class="list-unstyled mb-0 mt-3 pt-1">
              <li class="d-flex align-items-end mb-4">
                <i class="ti ti-check ti-lg"></i
                ><span class="fw-medium mx-2">Registration Number:</span>
                <span>{{ merchant.registration_number }}</span>
              </li>
              <li class="d-flex align-items-end mb-4">
                <i class="ti ti-layout-grid ti-lg"></i
                ><span class="fw-medium mx-2">Tourism License Number:</span>
                <span>{{ merchant.tourism_license_number }}</span>
              </li>
              <li class="d-flex align-items-end">
                <i class="ti ti-users ti-lg"></i><span class="fw-medium mx-2">TIN:</span>
                <span>{{ merchant.tin }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!--/ Profile Overview -->
      </div>
      <div class="col-xl-8 col-lg-7 col-md-7">
        <!-- Activity Timeline -->
        <div class="card card-action mb-6">
          <div class="card-header align-items-center">
            <h5 class="card-action-title mb-0">
              <i class="ti ti-chart-bar ti-lg text-body me-4"></i>Documents
            </h5>
          </div>
          <div class="card-body pt-3">
            <ul class="timeline mb-0">
              <li class="timeline-item timeline-item-transparent">
                <span class="timeline-point timeline-point-primary"></span>
                <div class="timeline-event">
                  <div class="timeline-header mb-3">
                    <h6 class="mb-0">Business Permits</h6>
                  </div>
                  <p class="mb-2">
                    <a :href="merchant.business_permits" target="_blank">{{
                      merchant.business_permits
                    }}</a>
                  </p>
                </div>
              </li>
              <li class="timeline-item timeline-item-transparent">
                <span class="timeline-point timeline-point-success"></span>
                <div class="timeline-event">
                  <div class="timeline-header mb-3">
                    <h6 class="mb-0">Membership Certificates</h6>
                  </div>
                  <p class="mb-2">
                    <a :href="merchant.membership_certificates" target="_blank">{{
                      merchant.membership_certificates
                    }}</a>
                  </p>
                </div>
              </li>
              <li class="timeline-item timeline-item-transparent">
                <span class="timeline-point timeline-point-info"></span>
                <div class="timeline-event">
                  <div class="timeline-header mb-3">
                    <h6 class="mb-0">Documents</h6>
                  </div>
                  <p class="mb-2">
                    <a :href="merchant.documents" target="_blank">{{ merchant.documents }}</a>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!--/ Activity Timeline -->
        <div class="row">
          <!-- Connections -->
          <div class="col-lg-12 col-xl-6">
            <div class="card card-action mb-6">
              <div class="card-header align-items-center">
                <h5 class="card-action-title mb-0">Branch Locations</h5>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li class="mb-4" v-for="location in merchant.branch_locations" :key="location">
                    <div class="d-flex align-items-center">
                      <div class="me-2">
                        <h6 class="mb-0">{{ location }}</h6>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--/ Connections -->
        </div>
      </div>
    </div>
    <!--/ User Profile Content -->
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
