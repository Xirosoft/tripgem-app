<template>
  <div>
    <h1>Add Permission</h1>
    <form @submit.prevent="addPermission">
      <div>
        <label for="permission_name">Permission Name:</label>
        <input type="text" v-model="permission_name" id="permission_name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" id="description"></textarea>
      </div>
      <button type="submit">Add Permission</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permission_name: '',
      description: '',
    }
  },
  methods: {
    async addPermission() {
      const response = await fetch('/wp-json/tripgem/v1/permissions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permission_name: this.permission_name,
          description: this.description,
        }),
      })
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
