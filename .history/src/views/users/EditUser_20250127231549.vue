<script>
import { handleFileUpload } from '@/utils/handleFileUpload'
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
          language: { value: '' },
        },
      },
      isLoading: false,
      message: null,
      messageType: null,
      parentRoles: [], // Parent roles fetched from the store or API
      filteredUserRoles: [], // User roles based on the selected parent role
      companies: [], // Companies based on the selected role
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
        this.userData.meta = this.userData.meta || {}
        this.userData.meta.location = this.userData.meta.location || { value: '' }
        this.userData.meta.profile_picture = this.userData.meta.profile_picture || { value: '' }
        this.userData.meta.cover_photo = this.userData.meta.cover_photo || { value: '' }
        this.userData.meta.language = this.userData.meta.language || { value: '' }
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        alert('Failed to load user data')
        this.$router.push('/users')
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
  },
  async created() {
    await this.initializeData()
  },
}
</script>

<template>
  <div class="offcanvas-body mx-0 flex-grow-0 p-6 h-100">
    <h1>Edit User</h1>
    <form class="add-new-user pt-0" @submit.prevent="submitForm">
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
          <option v-for="role in filteredUserRoles" :key="role.role_id" :value="role.role_id">
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
        <input
          type="text"
          class="form-control"
          id="edit-user-location"
          v-model="userData.meta.location.value"
          placeholder="New York, USA"
          name="userLocation"
          aria-label="New York, USA"
        />
      </div>
      <div class="mb-6">
        <label class="form-label" for="edit-user-profile-picture">Profile Picture URL</label>
        <input
          type="text"
          class="form-control"
          id="edit-user-profile-picture"
          v-model="userData.meta.profile_picture.value"
          placeholder="https://example.com/path/to/profile-picture.jpg"
          name="userProfilePicture"
          aria-label="https://example.com/path/to/profile-picture.jpg"
        />
        <input
          type="file"
          class="form-control mt-2"
          @change="handleFileUpload($event, 'profile_picture')"
        />
      </div>
      <div class="mb-6">
        <label class="form-label" for="edit-user-cover-photo">Cover Photo URL</label>
        <input
          type="text"
          class="form-control"
          id="edit-user-cover-photo"
          v-model="userData.meta.cover_photo.value"
          placeholder="https://example.com/path/to/cover-photo.jpg"
          name="userCoverPhoto"
          aria-label="https://example.com/path/to/cover-photo.jpg"
        />
        <input
          type="file"
          class="form-control mt-2"
          @change="handleFileUpload($event, 'cover_photo')"
        />
      </div>
      <div class="mb-6">
        <label class="form-label" for="edit-user-language">Preferred Language</label>
        <input
          type="text"
          class="form-control"
          id="edit-user-language"
          v-model="userData.meta.language.value"
          placeholder="English"
          name="userLanguage"
          aria-label="English"
        />
      </div>
      <button type="submit" class="btn btn-primary me-3 data-submit" :disabled="isLoading">
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span>Save</span>
      </button>
      <button type="reset" class="btn btn-label-danger" @click="cancelEdit" :disabled="isLoading">
        Cancel
      </button>
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
</template>
