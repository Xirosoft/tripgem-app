<template>
  <div>
    <h1>Permissions List</h1>
    <ul>
      <li v-for="permission in permissions" :key="permission.permission_id">
        {{ permission.permission_name }}
        <router-link :to="{ name: 'EditPermission', params: { id: permission.permission_id } }"
          >Edit</router-link
        >
      </li>
    </ul>
    <router-link to="/permissions/add">Add New Permission</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permissions: [],
    }
  },
  created() {
    this.fetchPermissions()
  },
  methods: {
    async fetchPermissions() {
      const response = await fetch('/wp-json/tripgem/v1/permissions/view')
      const data = await response.json()
      this.permissions = data.data
    },
  },
}
</script>
