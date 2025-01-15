<template>
  <div>
    <h1>Edit Permission</h1>
    <form @submit.prevent="editPermission">
      <div>
        <label for="permission_name">Permission Name:</label>
        <input type="text" v-model="permission_name" id="permission_name" required />
      </div>
      <button type="submit">Update Permission</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permission_name: '',
    }
  },
  created() {
    this.fetchPermission()
  },
  methods: {
    async fetchPermission() {
      const response = await fetch(`/wp-json/tripgem/v1/permissions/view/${this.$route.params.id}`)
      const data = await response.json()
      this.permission_name = data.data.permission_name
    },
    async editPermission() {
      const response = await fetch(
        `/wp-json/tripgem/v1/permissions/edit/${this.$route.params.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            permission_name: this.permission_name,
          }),
        },
      )
      const data = await response.json()
      if (data.success) {
        this.$router.push('/permissions')
      } else {
        alert(data.message)
      }
    },
  },
}
</script>
