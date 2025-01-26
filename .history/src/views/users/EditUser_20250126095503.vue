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
        <label class="form-label" for="edit-user-role">User Role</label>
        <select id="edit-user-role" class="form-select" v-model="userData.role_id" name="userRole">
          <option value="" disabled>Select User Role</option>
          <option v-for="role in roles" :key="role.role_id" :value="role.role_id">
            {{ role.role_name }}
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
      <!-- Add other fields as necessary -->
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

<script>
import { useUsersListStore } from '../../stores/users/UsersList.js'

export default {
  name: 'EditUser',
  props: ['userId'],
  data() {
    return {
      userData: null,
      isLoading: false,
      message: null,
      messageType: null,
      roles: [], // Assuming roles are fetched from the store or API
    }
  },
  methods: {
    async submitForm() {
      this.isLoading = true
      try {
        const message = await this.usersListStore.editUser(this.userId, this.userData)
        this.message = message
        this.messageType = 'success'
        this.$router.push('/users')
      } catch (error) {
        console.error('Failed to update user:', error)
        this.message = 'Failed to update user'
        this.messageType = 'danger'
      } finally {
        this.isLoading = false
      }
    },
    cancelEdit() {
      this.$router.push('/users')
    },
  },
  async created() {
    this.usersListStore = useUsersListStore()
    try {
      this.userData = JSON.parse(decodeURIComponent(this.$route.query.userData))
    } catch (error) {
      console.error('Failed to parse user data:', error)
      alert('Failed to load user data')
      this.$router.push('/users')
    }
    // Fetch roles from the store or API
    await this.usersListStore.fetchRoles()
    this.roles = this.usersListStore.getRoles
  },
}
</script>
