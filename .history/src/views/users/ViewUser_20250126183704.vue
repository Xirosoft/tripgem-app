<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h3>User Details</h3>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">First Name:</label>
            <p>{{ userData.first_name }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label">Last Name:</label>
            <p>{{ userData.last_name }}</p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Email:</label>
            <p>{{ userData.email }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label">Phone:</label>
            <p>{{ userData.phone_number }}</p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Role:</label>
            <p>{{ userData.role_name }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label">Status:</label>
            <p>{{ userData.status }}</p>
          </div>
        </div>
        <div class="row mb-3" v-if="companyData">
          <div class="col-md-6">
            <label class="form-label">Company:</label>
            <p>
              {{
                companyData.company_name ||
                companyData.merchant_name ||
                companyData.agency_name ||
                companyData.name ||
                companyData.b2b_name
              }}
            </p>
          </div>
          <div class="col-md-6">
            <label class="form-label">Company Role:</label>
            <p>{{ companyData.role_name }}</p>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Created At:</label>
            <p>{{ userData.created_at }}</p>
          </div>
        </div>
        <button class="btn btn-primary" @click="goBack">Back</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserEditStore } from '../../stores/users/UserEdit.js'

export default {
  name: 'ViewUser',
  props: ['userId'],
  data() {
    return {
      userData: null,
      companyData: null,
    }
  },
  methods: {
    async fetchUserDetails() {
      const userEditStore = useUserEditStore()
      try {
        await userEditStore.fetchUserDetails(this.userId)
        this.userData = userEditStore.userData
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

<style scoped>
.container {
  max-width: 800px;
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
