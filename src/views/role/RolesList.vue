<template>
  <div>
    <h1>Roles List</h1>
    <ul>
      <li v-for="role in roles" :key="role.role_id">
        {{ role.role_name }}
        <router-link :to="{ name: 'EditRole', params: { id: role.role_id } }">Edit</router-link>
      </li>
    </ul>
    <router-link to="/roles/add">Add New Role</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
    }
  },
  created() {
    this.fetchRoles()
  },
  methods: {
    async fetchRoles() {
      const response = await fetch('/wp-json/tripgem/v1/roles/view')
      const data = await response.json()
      this.roles = data.data
    },
  },
}
</script>
