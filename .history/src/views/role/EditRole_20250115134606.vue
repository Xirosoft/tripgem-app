<template>
  <div>
    <h1>Edit Role</h1>
    <form @submit.prevent="editRole">
      <div>
        <label for="role_name">Role Name:</label>
        <input type="text" v-model="role_name" id="role_name" required />
      </div>
      <button type="submit">Update Role</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role_name: '',
    }
  },
  created() {
    this.fetchRole()
  },
  methods: {
    async fetchRole() {
      const response = await fetch(`/wp-json/tripgem/v1/roles/view/${this.$route.params.id}`)
      const data = await response.json()
      this.role_name = data.data.role_name
    },
    async editRole() {
      const response = await fetch(`/wp-json/tripgem/v1/roles/edit/${this.$route.params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_name: this.role_name,
        }),
      })
      const data = await response.json()
      if (data.success) {
        this.$router.push('/roles')
      } else {
        alert(data.message)
      }
    },
  },
}
</script>
