<template>
  <div>
    <h1>Add Role</h1>
    <form @submit.prevent="addRole">
      <div>
        <label for="role_name">Role Name:</label>
        <input type="text" v-model="role_name" id="role_name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" id="description"></textarea>
      </div>
      <button type="submit">Add Role</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      role_name: '',
      description: '',
    }
  },
  methods: {
    async addRole() {
      const response = await fetch('/wp-json/tripgem/v1/roles/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_name: this.role_name,
          description: this.description,
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
