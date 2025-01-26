<template>
  <div>
    <h1>Edit User</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="first_name">First Name:</label>
        <input type="text" v-model="userData.first_name" id="first_name" />
      </div>
      <div>
        <label for="last_name">Last Name:</label>
        <input type="text" v-model="userData.last_name" id="last_name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="userData.email" id="email" />
      </div>
      <div>
        <label for="phone_number">Phone Number:</label>
        <input type="text" v-model="userData.phone_number" id="phone_number" />
      </div>
      <div>
        <label for="role_id">Role:</label>
        <input type="number" v-model="userData.role_id" id="role_id" />
      </div>
      <div>
        <label for="status">Status:</label>
        <input type="text" v-model="userData.status" id="status" />
      </div>
      <!-- Add other fields as necessary -->
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import { useUsersListStore } from '../../stores/users/UsersList.js'

export default {
  name: 'EditUser',
  props: ['userId'],
  data() {
    return {
      userData: JSON.parse(this.$route.query.userData),
      isLoading: false,
    }
  },
  methods: {
    async submitForm() {
      this.isLoading = true
      try {
        const message = await this.usersListStore.editUser(this.userId, this.userData)
        alert(message)
        this.$router.push('/users')
      } catch (error) {
        console.error('Failed to update user:', error)
        alert('Failed to update user')
      } finally {
        this.isLoading = false
      }
    },
  },
  created() {
    this.usersListStore = useUsersListStore()
  },
}
</script>
