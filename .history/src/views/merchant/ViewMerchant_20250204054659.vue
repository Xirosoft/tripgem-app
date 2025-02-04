<script>
import { useViewMerchantsStore } from '../../stores/merchant/ViewMerchant.js'

export default {
  name: 'ViewUser',
  props: ['userId'],
  setup() {
    const store = useViewMerchantsStore()
    const merchant = store.fetchMerchant(this.userId)
    console.log(merchant)
    return {
      merchant,
    }
  },
}
</script>

<template>
  <!-- Header -->
  <div class="row">
    <div class="col-12">
      <div class="card mb-6">
        <div class="user-profile-header-banner">
          <!-- <img :src="merchant.bannerImage" alt="Banner image" class="rounded-top" /> -->
        </div>
        <div
          class="user-profile-header d-flex flex-column flex-lg-row text-sm-start text-center mb-5"
        >
          <div class="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
            <img
              :src="merchant.profileImage"
              alt="user image"
              class="d-block h-auto ms-0 ms-sm-6 rounded user-profile-img"
            />
          </div>
          <div class="flex-grow-1 mt-3 mt-lg-5">
            <div
              class="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-4"
            >
              <div class="user-profile-info">
                <h4 class="mb-2 mt-lg-6">{{ merchant.name }}</h4>
                <ul
                  class="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4 my-2"
                >
                  <li class="list-inline-item d-flex gap-2 align-items-center">
                    <i class="ti ti-palette ti-lg"></i
                    ><span class="fw-medium">{{ merchant.role }}</span>
                  </li>
                  <li class="list-inline-item d-flex gap-2 align-items-center">
                    <i class="ti ti-map-pin ti-lg"></i
                    ><span class="fw-medium">{{ merchant.location }}</span>
                  </li>
                  <li class="list-inline-item d-flex gap-2 align-items-center">
                    <i class="ti ti-calendar ti-lg"></i
                    ><span class="fw-medium"> Joined {{ merchant.joinDate }}</span>
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
              <span>{{ merchant.name }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-check ti-lg"></i><span class="fw-medium mx-2">Status:</span>
              <span>{{ merchant.status }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-crown ti-lg"></i><span class="fw-medium mx-2">Role:</span>
              <span>{{ merchant.role }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-flag ti-lg"></i><span class="fw-medium mx-2">Country:</span>
              <span>{{ merchant.country }}</span>
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
              <span>{{ merchant.contact }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-messages ti-lg"></i><span class="fw-medium mx-2">Skype:</span>
              <span>{{ merchant.skype }}</span>
            </li>
            <li class="d-flex align-items-center mb-4">
              <i class="ti ti-mail ti-lg"></i><span class="fw-medium mx-2">Email:</span>
              <span>{{ merchant.email }}</span>
            </li>
          </ul>
          <small class="card-text text-uppercase text-muted small">Teams</small>
          <ul class="list-unstyled mb-0 mt-3 pt-1">
            <li class="d-flex flex-wrap mb-4" v-for="team in merchant.teams" :key="team.name">
              <span class="fw-medium me-2">{{ team.name }}</span
              ><span>({{ team.members }} Members)</span>
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
              <i class="ti ti-check ti-lg"></i><span class="fw-medium mx-2">Task Compiled:</span>
              <span>{{ merchant.tasksCompiled }}</span>
            </li>
            <li class="d-flex align-items-end mb-4">
              <i class="ti ti-layout-grid ti-lg"></i
              ><span class="fw-medium mx-2">Projects Compiled:</span>
              <span>{{ merchant.projectsCompiled }}</span>
            </li>
            <li class="d-flex align-items-end">
              <i class="ti ti-users ti-lg"></i><span class="fw-medium mx-2">Connections:</span>
              <span>{{ merchant.connections }}</span>
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
            <i class="ti ti-chart-bar ti-lg text-body me-4"></i>Activity Timeline
          </h5>
        </div>
        <div class="card-body pt-3">
          <ul class="timeline mb-0">
            <li
              class="timeline-item timeline-item-transparent"
              v-for="activity in merchant.activities"
              :key="activity.id"
            >
              <span :class="`timeline-point timeline-point-${activity.type}`"></span>
              <div class="timeline-event">
                <div class="timeline-header mb-3">
                  <h6 class="mb-0">{{ activity.title }}</h6>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
                <p class="mb-2">{{ activity.description }}</p>
                <div v-if="activity.attachment" class="d-flex align-items-center mb-2">
                  <div class="badge bg-lighter rounded d-flex align-items-center">
                    <img :src="activity.attachment.icon" alt="img" width="15" class="me-2" />
                    <span class="h6 mb-0 text-body">{{ activity.attachment.name }}</span>
                  </div>
                </div>
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
              <h5 class="card-action-title mb-0">Connections</h5>
              <div class="card-action-element">
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-icon btn-text-secondary rounded-pill dropdown-toggle hide-arrow p-0 text-muted"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="ti ti-dots-vertical ti-md text-muted"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="javascript:void(0);">Share connections</a>
                    </li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Suggest edits</a></li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Report bug</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li
                  class="mb-4"
                  v-for="connection in merchant.connectionsList"
                  :key="connection.name"
                >
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center">
                      <div class="avatar me-2">
                        <img :src="connection.avatar" alt="Avatar" class="rounded-circle" />
                      </div>
                      <div class="me-2">
                        <h6 class="mb-0">{{ connection.name }}</h6>
                        <small>{{ connection.count }} Connections</small>
                      </div>
                    </div>
                    <div class="ms-auto">
                      <button
                        class="btn"
                        :class="connection.isConnected ? 'btn-label-primary' : 'btn-primary'"
                      >
                        <i
                          :class="connection.isConnected ? 'ti ti-user-check' : 'ti ti-user-x'"
                        ></i>
                      </button>
                    </div>
                  </div>
                </li>
                <li class="text-center">
                  <a href="javascript:;">View all connections</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--/ Connections -->
        <!-- Teams -->
        <div class="col-lg-12 col-xl-6">
          <div class="card card-action mb-6">
            <div class="card-header align-items-center">
              <h5 class="card-action-title mb-0">Teams</h5>
              <div class="card-action-element">
                <div class="dropdown">
                  <button
                    type="button"
                    class="btn btn-icon btn-text-secondary dropdown-toggle hide-arrow p-0"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i class="ti ti-dots-vertical text-muted"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="javascript:void(0);">Share teams</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Suggest edits</a></li>
                    <li>
                      <hr class="dropdown-divider" />
                    </li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Report bug</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="card-body">
              <ul class="list-unstyled mb-0">
                <li class="mb-4" v-for="team in merchant.teamsList" :key="team.name">
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center">
                      <div class="avatar me-2">
                        <img :src="team.avatar" alt="Avatar" class="rounded-circle" />
                      </div>
                      <div class="me-2">
                        <h6 class="mb-0">{{ team.name }}</h6>
                        <small>{{ team.members }} Members</small>
                      </div>
                    </div>
                    <div class="ms-auto">
                      <a href="javascript:;"
                        ><span :class="`badge bg-label-${team.role}`">{{ team.role }}</span></a
                      >
                    </div>
                  </div>
                </li>
                <li class="text-center">
                  <a href="javascript:;">View all teams</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--/ Teams -->
      </div>
      <!-- Projects table -->
      <div class="card mb-4">
        <div class="card-datatable table-responsive">
          <table class="datatables-projects table border-top">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Project</th>
                <th>Leader</th>
                <th>Team</th>
                <th class="w-px-200">Progress</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in merchant.projects" :key="project.name">
                <td></td>
                <td></td>
                <td>{{ project.name }}</td>
                <td>{{ project.leader }}</td>
                <td>{{ project.team }}</td>
                <td>{{ project.progress }}</td>
                <td>
                  <button class="btn btn-primary">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--/ Projects table -->
    </div>
  </div>
  <!--/ User Profile Content -->
</template>
