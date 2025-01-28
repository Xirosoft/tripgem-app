<script>
import { handleFileUpload } from '@/utils/handleFileUpload'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { useUserEditStore } from '../../stores/users/UserEdit.js'

export default {
  name: 'EditUser',
  props: ['userId'],
  data() {
    return {
      userData: {
        meta: {
          location: { value: '' },
          profile_picture: { value: '' },
          cover_photo: { value: '' },
          language: { value: [] },
          social_links: {
            twitter: '',
            facebook: '',
            line: '',
            linkedin: '',
            instagram: '',
            tiktok: '',
          },
        },
      },
      isLoading: false,
      message: null,
      messageType: null,
      parentRoles: [], // Parent roles fetched from the store or API
      filteredUserRoles: [], // User roles based on the selected parent role
      companies: [], // Companies based on the selected role
      languages: ['English', 'French', 'German', 'Spanish'], // Example languages
      locations: ['New York, USA', 'London, UK', 'Paris, France', 'Berlin, Germany'], // Example locations
    }
  },
  methods: {
    async submitForm() {
      this.isLoading = true
      try {
        const submitData = {
          ...this.userData,
          meta: {
            location: this.userData.meta.location.value,
            profile_picture: this.userData.meta.profile_picture.value,
            cover_photo: this.userData.meta.cover_photo.value,
            language: this.userData.meta.language.value,
            social_links: this.userData.meta.social_links,
          },
        }
        console.log('submitData:', submitData)

        const message = await this.userEditStore.editUser(this.userId, submitData)
        this.message = message
        this.messageType = 'success'
        // this.$router.push('/users')
      } catch (error) {
        console.error('Failed to update user:', error)
        this.message = 'Failed to update user'
        this.messageType = 'danger'
      } finally {
        this.isLoading = false
      }
    },
    cancelEdit() {
      // this.$router.push('/users')
    },
    async onParentRoleChange() {
      this.userEditStore.filterUserRoles(this.userData.parent_role_id)
      this.filteredUserRoles = this.userEditStore.getFilteredUserRoles
      this.userData.role_id = '' // Reset user role selection
      this.companies = [] // Reset companies selection
    },
    async onRoleChange() {
      if (['19', '6', '16', '12'].includes(this.userData.parent_role_id)) {
        await this.userEditStore.fetchCompanies(this.userData.parent_role_id)
        this.companies = this.userEditStore.getCompanies
      } else {
        this.companies = []
      }
    },
    async initializeData() {
      this.userEditStore = useUserEditStore()
      try {
        await this.userEditStore.fetchUserDetails(this.userId)
        this.userData = this.userEditStore.userData
        // Ensure meta properties are initialized
        console.log('userData:', this.userData)

        this.userData.meta = this.userData.meta || {}
        this.userData.meta.location = { value: this.userData.meta.location || '' }
        this.userData.meta.profile_picture = { value: this.userData.meta.profile_picture || '' }
        this.userData.meta.cover_photo = { value: this.userData.meta.cover_photo || '' }
        this.userData.meta.language =
          typeof this.userData.meta.language === 'string'
            ? { value: JSON.parse(this.userData.meta.language) }
            : { value: this.userData.meta.language || [] }
        this.userData.meta.social_links =
          typeof this.userData.meta.social_links === 'string'
            ? JSON.parse(this.userData.meta.social_links)
            : this.userData.meta.social_links || {
                twitter: '',
                facebook: '',
                line: '',
                linkedin: '',
                instagram: '',
                tiktok: '',
              }
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        alert('Failed to load user data')
        // this.$router.push('/users')
      }
      // Fetch roles from the store or API
      await this.userEditStore.fetchRoles()
      this.parentRoles = this.userEditStore.getParentRoles
      // Fetch user roles if parent role is already selected
      if (this.userData.parent_role_id) {
        this.userEditStore.filterUserRoles(this.userData.parent_role_id)
        this.filteredUserRoles = this.userEditStore.getFilteredUserRoles
      }
      // Fetch companies if role is already selected
      if (['19', '6', '16', '12'].includes(this.userData.parent_role_id)) {
        await this.userEditStore.fetchCompanies(this.userData.parent_role_id)
        this.companies = this.userEditStore.getCompanies
      }
    },
    async handleFileUpload(event, key) {
      const files = await handleFileUpload(event, key)
      if (files.length > 0) {
        this.userData.meta[key].value = files[0]
      }
    },
    initializeSelect2() {
      const vm = this
      $(this.$refs.languageSelect)
        .select2({
          data: this.languages.map((lang) => ({ id: lang, text: lang })),
          multiple: true,
        })
        .val(this.userData.meta.language.value)
        .trigger('change')
        .on('change', function () {
          vm.userData.meta.language.value = $(this).val()
        })
    },
  },
  async created() {
    await this.initializeData()
  },
  mounted() {
    this.initializeSelect2()
  },
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl mb-6">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">User Information</h5>
            <router-link :to="'/users/profile/' + userId" class="btn btn-primary mb-1">
              <i class="ti ti-eye ti-xs me-2"></i>Profile
            </router-link>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-firstname">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="edit-user-firstname"
                      v-model="userData.first_name"
                      placeholder="John"
                      name="userfirstname"
                      aria-label="John"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-lastname">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="edit-user-lastname"
                      v-model="userData.last_name"
                      placeholder="Doe"
                      name="userlastname"
                      aria-label="Doe"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-email">Email</label>
                    <input
                      type="email"
                      id="edit-user-email"
                      class="form-control"
                      v-model="userData.email"
                      placeholder="john.doe@example.com"
                      aria-label="john.doe@example.com"
                      name="userEmail"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-contact">Phone</label>
                    <input
                      type="text"
                      id="edit-user-contact"
                      class="form-control phone-mask"
                      v-model="userData.phone_number"
                      placeholder="+1 (609) 988-44-11"
                      aria-label="john.doe@example.com"
                      name="userContact"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="parent-role">Parent Role</label>
                    <select
                      id="parent-role"
                      class="form-select"
                      v-model="userData.parent_role_id"
                      name="parentRole"
                      @change="onParentRoleChange"
                    >
                      <option value="">Select Parent Role</option>
                      <option v-for="role in parentRoles" :key="role.role_id" :value="role.role_id">
                        {{ role.role_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-role">User Role</label>
                    <select
                      id="edit-user-role"
                      class="form-select"
                      v-model="userData.role_id"
                      name="userRole"
                      @change="onRoleChange"
                    >
                      <option value="" disabled>Select User Role</option>
                      <option
                        v-for="role in filteredUserRoles"
                        :key="role.role_id"
                        :value="role.role_id"
                      >
                        {{ role.role_name }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-6" v-if="companies.length > 0">
                    <label class="form-label" for="edit-user-company">Company</label>
                    <select
                      id="edit-user-company"
                      class="form-select"
                      v-model="userData.company_id"
                      name="userCompany"
                    >
                      <option value="">Select Company</option>
                      <option v-for="company in companies" :key="company.id" :value="company.id">
                        {{
                          company.company_name ||
                          company.merchant_name ||
                          company.agency_name ||
                          company.name ||
                          company.b2b_name
                        }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-status">Status</label>
                    <select
                      id="edit-user-status"
                      class="form-select"
                      v-model="userData.status"
                      name="userStatus"
                    >
                      <option value="pending">Pending</option>
                      <option value="reject">Reject</option>
                      <option value="approved">Approved</option>
                      <option value="hold">Hold</option>
                      <option value="warning">Warning</option>
                      <option value="suspend">Suspend</option>
                    </select>
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-location">Location</label>
                    <select
                      id="edit-user-location"
                      class="form-select"
                      v-model="userData.meta.location.value"
                      name="userLocation"
                    >
                      <option value="">Select Location</option>
                      <option v-for="location in locations" :key="location" :value="location">
                        {{ location }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-profile-picture"
                      >Profile Picture</label
                    >
                    <div class="mb-2">
                      <img
                        :src="userData.meta.profile_picture.value"
                        alt="Profile Picture"
                        class="img-thumbnail"
                        v-if="userData.meta.profile_picture.value"
                        style="width: 200px; height: 150px; object-fit: cover"
                      />
                    </div>
                    <input
                      type="file"
                      class="form-control"
                      @change="handleFileUpload($event, 'profile_picture')"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-cover-photo">Cover Photo</label>
                    <div class="mb-2">
                      <img
                        :src="userData.meta.cover_photo.value"
                        alt="Cover Photo"
                        class="img-thumbnail"
                        v-if="userData.meta.cover_photo.value"
                        style="width: 200px; height: 150px; object-fit: cover"
                      />
                    </div>
                    <input
                      type="file"
                      class="form-control"
                      @change="handleFileUpload($event, 'cover_photo')"
                    />
                  </div>
                  <div class="mb-6 select2-primary">
                    <label class="form-label" for="edit-user-language">Preferred Language</label>
                    <select
                      id="edit-user-language"
                      class="form-select"
                      ref="languageSelect"
                      multiple
                      v-model="userData.meta.language.value"
                      name="userLanguage"
                    >
                      <option value="">Select Language</option>
                      <option v-for="language in languages" :key="language" :value="language">
                        {{ language }}
                      </option>
                    </select>
                    <div class="mt-2">
                      <span
                        v-for="lang in userData.meta.language.value"
                        :key="lang"
                        class="badge bg-primary me-1"
                      >
                        {{ lang }}
                      </span>
                    </div>
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="edit-user-bio">Bio</label>
                    <textarea
                      id="edit-user-bio"
                      class="form-control"
                      v-model="userData.meta.bio"
                      placeholder="Enter bio description"
                      name="userBio"
                      aria-label="Enter bio description"
                    ></textarea>
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-twitter">Twitter</label>
                    <input
                      type="text"
                      id="formtabs-twitter"
                      class="form-control"
                      v-model="userData.meta.social_links.twitter"
                      placeholder="https://twitter.com/abc"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-facebook">Facebook</label>
                    <input
                      type="text"
                      id="formtabs-facebook"
                      class="form-control"
                      v-model="userData.meta.social_links.facebook"
                      placeholder="https://facebook.com/abc"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-line">Line</label>
                    <input
                      type="text"
                      id="formtabs-line"
                      class="form-control"
                      v-model="userData.meta.social_links.line"
                      placeholder="https://line.me/abc"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-linkedin">LinkedIn</label>
                    <input
                      type="text"
                      id="formtabs-linkedin"
                      class="form-control"
                      v-model="userData.meta.social_links.linkedin"
                      placeholder="https://linkedin.com/in/abc"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-instagram">Instagram</label>
                    <input
                      type="text"
                      id="formtabs-instagram"
                      class="form-control"
                      v-model="userData.meta.social_links.instagram"
                      placeholder="https://instagram.com/abc"
                    />
                  </div>
                  <div class="mb-6">
                    <label class="form-label" for="formtabs-tiktok">Tiktok</label>
                    <input
                      type="text"
                      id="formtabs-tiktok"
                      class="form-control"
                      v-model="userData.meta.social_links.tiktok"
                      placeholder="https://tiktok.com/@abc"
                    />
                  </div>
                </div>
              </div>
              <div class="row justify-content-start">
                <div class="col-sm-10">
                  <button
                    type="submit"
                    class="btn btn-primary me-3 data-submit"
                    :disabled="isLoading"
                  >
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Save</span>
                  </button>
                  <button
                    type="reset"
                    class="btn btn-label-danger"
                    @click="cancelEdit"
                    :disabled="isLoading"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
            <br />
            <div
              v-if="message"
              :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']"
              role="alert"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
