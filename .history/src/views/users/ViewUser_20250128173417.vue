<script>
import { useUserEditStore } from '../../stores/users/UserEdit.js'

export default {
  name: 'ViewUser',
  props: ['userId'],
  data() {
    return {
      userData: null,
      companyData: null,
      roleName: '',
      companyName: '',
    }
  },
  methods: {
    async fetchUserDetails() {
      const userEditStore = useUserEditStore()
      try {
        await userEditStore.fetchUserDetails(this.userId)
        this.userData = userEditStore.userData
        this.roleName = userEditStore.roleName
        this.companyName = userEditStore.companyName
        console.log(userData.meta)

        console.log('userData:', this.userData)
        if (userEditStore.userData.parent_role_id === '16') {
          this.companyData = userEditStore.userData.affiliate_data
        } else if (userEditStore.userData.parent_role_id === '12') {
          this.companyData = userEditStore.userData.agency_data
        } else if (userEditStore.userData.parent_role_id === '19') {
          this.companyData = userEditStore.userData.b2b_data
        } else if (userEditStore.userData.parent_role_id === '6') {
          this.companyData = userEditStore.userData.merchant_data
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        alert('Failed to load user data')
        this.$router.push('/users')
      }
    },
    goBack() {
      this.$router.push('/users')
    },
  },
  async created() {
    await this.fetchUserDetails()
  },
}
</script>

<template>
  <!-- Header -->
  <div class="row">
    <div class="col-12">
      <div class="card mb-6">
        <div class="user-profile-header-banner">
          <img :src="userData.meta.cover_photo" alt="Banner image" class="rounded-top" />
        </div>
        <div
          class="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5"
        >
          <div class="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
            <img
              :src="userData.meta.profile_picture"
              alt="user image"
              class="d-block h-auto ms-0 ms-sm-6 rounded user-profile-img"
            />
          </div>
          <div class="flex-grow-1 mt-3 mt-lg-5">
            <div
              class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4"
            >
              <div class="user-profile-info">
                <h4 class="mb-2 mt-lg-6">{{ userData.first_name }} {{ userData.last_name }}</h4>
                <ul
                  class="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2"
                >
                  <li class="list-inline-item d-flex gap-2 align-items-center">
                    <i class="ti ti-palette ti-lg"></i><span class="fw-medium">{{ roleName }}</span>
                  </li>
                  <li class="list-inline-item d-flex gap-2 align-items-center">
                    <i class="ti ti-calendar ti-lg"></i
                    ><span class="fw-medium"
                      >Joined
                      {{
                        new Date(userData.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      }}</span
                    >
                  </li>
                </ul>
              </div>
              <div class="social_links">
                <a
                  v-if="userData.meta.facebook_link"
                  :href="userData.meta.facebook_link"
                  target="_blank"
                  class="btn btn-icon btn-outline-primary"
                >
                  <i class="ti ti-brand-facebook"></i>
                </a>
                <a
                  v-if="userData.meta.twitter_link"
                  :href="userData.meta.twitter_link"
                  target="_blank"
                  class="btn btn-icon btn-outline-info"
                >
                  <i class="ti ti-brand-twitter"></i>
                </a>
                <a
                  v-if="userData.meta.linkedin_link"
                  :href="userData.meta.linkedin_link"
                  target="_blank"
                  class="btn btn-icon btn-outline-primary"
                >
                  <i class="ti ti-brand-linkedin"></i>
                </a>
                <a
                  v-if="userData.meta.instagram_link"
                  :href="userData.meta.instagram_link"
                  target="_blank"
                  class="btn btn-icon btn-outline-danger"
                >
                  <i class="ti ti-brand-instagram"></i>
                </a>
              </div>

              <router-link :to="'/users/edit/' + userId" class="btn btn-primary mb-1">
                <i class="ti ti-user-check ti-xs me-2"></i>Edit
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--/ Header -->

  <!-- Navbar pills -->
  <!-- <div class="row">
      <div class="col-md-12">
        <div class="nav-align-top">
          <ul class="nav nav-pills flex-column flex-sm-row mb-6 gap-2 gap-lg-0">
            <li class="nav-item">
              <a class="nav-link active" href="javascript:void(0);"
                ><i class="ti-sm ti ti-user-check me-1_5"></i> Profile</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);"
                ><i class="ti-sm ti ti-users me-1_5"></i> Teams</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);"
                ><i class="ti-sm ti ti-layout-grid me-1_5"></i> Projects</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);"
                ><i class="ti-sm ti ti-link me-1_5"></i> Connections</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div> -->
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
              <span>{{ userData.first_name }} {{ userData.last_name }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-check ti-lg"></i><span class="fw-medium mx-2">Status:</span>
              <span>{{ userData.status }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-crown ti-lg"></i><span class="fw-medium mx-2">Role:</span>
              <span>{{ roleName }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-flag ti-lg"></i><span class="fw-medium mx-2">Country:</span>
              <span>{{ userData.meta.location }}</span>
            </li>
            <li class="d-flex align-items-center mb-2">
              <i class="ti ti-language ti-lg"></i><span class="fw-medium mx-2">Languages:</span>
              <span>{{ userData.meta.language }}</span>
            </li>
          </ul>
          <small class="card-text text-uppercase text-muted small">Contacts</small>
          <ul class="list-unstyled my-3 py-1">
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-phone-call ti-lg"></i><span class="fw-medium mx-2">Contact:</span>
              <span>{{ userData.phone_number }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-mail ti-lg"></i><span class="fw-medium mx-2">Email:</span>
              <span>{{ userData.email }}</span>
            </li>
          </ul>
          <small class="card-text text-uppercase text-muted small">Company</small>
          <ul class="list-unstyled mb-0 mt-3 pt-1" v-if="companyData">
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-building ti-lg"></i><span class="fw-medium mx-2">Company:</span>
              <span>
                {{
                  companyData.company_name ||
                  companyData.merchant_name ||
                  companyData.agency_name ||
                  companyData.name ||
                  companyData.b2b_name
                }}
              </span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-briefcase ti-lg"></i><span class="fw-medium mx-2">Company Role:</span>
              <span>{{ companyData.role_name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!--/ About User -->
    </div>
    <div class="col-xl-8 col-lg-7 col-md-7">
      <!-- Activity Timeline -->
      <div class="card card-action mb-6">
        <div class="card-header align-items-center">
          <h5 class="card-action-title mb-0">
            <i class="ti ti-chart-bar ti-lg text-body me-4"></i>Activity Timeline
          </h5>
        </div>
        <div class="card-body pt-3">
          <ul class="timeline mb-0">
            <li class="timeline-item timeline-item-transparent">
              <span class="timeline-point timeline-point-primary"></span>
              <div class="timeline-event">
                <div class="timeline-header mb-3">
                  <h6 class="mb-0">12 Invoices have been paid</h6>
                  <small class="text-muted">12 min ago</small>
                </div>
                <p class="mb-2">Invoices have been paid to the company</p>
                <div class="d-flex align-items-center mb-2">
                  <div class="badge bg-lighter rounded d-flex align-items-center">
                    <img
                      src="../../assets//img/icons/misc/pdf.png"
                      alt="img"
                      width="15"
                      class="me-2"
                    />
                    <span class="h6 mb-0 text-body">invoices.pdf</span>
                  </div>
                </div>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent">
              <span class="timeline-point timeline-point-success"></span>
              <div class="timeline-event">
                <div class="timeline-header mb-3">
                  <h6 class="mb-0">Client Meeting</h6>
                  <small class="text-muted">45 min ago</small>
                </div>
                <p class="mb-2">Project meeting with john @10:15am</p>
                <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
                  <div class="d-flex flex-wrap align-items-center mb-50">
                    <div class="avatar avatar-sm me-3">
                      <img
                        src="../../assets/img/avatars/1.png"
                        alt="Avatar"
                        class="rounded-circle"
                      />
                    </div>
                    <div>
                      <p class="mb-0 small fw-medium">Lester McCarthy (Client)</p>
                      <small>CEO of Pixinvent</small>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="timeline-item timeline-item-transparent">
              <span class="timeline-point timeline-point-info"></span>
              <div class="timeline-event">
                <div class="timeline-header mb-3">
                  <h6 class="mb-0">Create a new project for client</h6>
                  <small class="text-muted">2 Day Ago</small>
                </div>
                <p class="mb-2">6 team members in a project</p>
                <ul class="list-group list-group-flush">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center flex-wrap border-top-0 p-0"
                  >
                    <div class="d-flex flex-wrap align-items-center">
                      <ul
                        class="list-unstyled users-list d-flex align-items-center avatar-group m-0 me-2"
                      >
                        <li
                          data-bs-toggle="tooltip"
                          data-popup="tooltip-custom"
                          data-bs-placement="top"
                          title="Vinnie Mostowy"
                          class="avatar pull-up"
                        >
                          <img
                            class="rounded-circle"
                            src="../../assets/img/avatars/1.png"
                            alt="Avatar"
                          />
                        </li>
                        <li
                          data-bs-toggle="tooltip"
                          data-popup="tooltip-custom"
                          data-bs-placement="top"
                          title="Allen Rieske"
                          class="avatar pull-up"
                        >
                          <img
                            class="rounded-circle"
                            src="../../assets/img/avatars/4.png"
                            alt="Avatar"
                          />
                        </li>
                        <li
                          data-bs-toggle="tooltip"
                          data-popup="tooltip-custom"
                          data-bs-placement="top"
                          title="Julee Rossignol"
                          class="avatar pull-up"
                        >
                          <img
                            class="rounded-circle"
                            src="../../assets/img/avatars/2.png"
                            alt="Avatar"
                          />
                        </li>
                        <li class="avatar">
                          <span
                            class="avatar-initial rounded-circle pull-up text-heading"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="3 more"
                            >+3</span
                          >
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--/ Activity Timeline -->
    </div>
  </div>
  <!--/ User Profile Content -->
</template>
<style scoped>
.container {
  max-width: 1200px;
}
.user-profile-header-banner img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.user-profile-img {
  width: 150px;
  height: 150px;
  border: 5px solid #fff;
}
.card-header {
  background-color: #007bff;
  color: white;
}
.card-body {
  padding: 20px;
}
.form-label {
  font-weight: bold;
}
</style>
