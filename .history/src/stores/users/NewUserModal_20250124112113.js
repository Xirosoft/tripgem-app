import axios from 'axios'
import { defineStore } from 'pinia'

export const useNewUserModal = defineStore('newUserModal', {
  state: () => ({
    roles: [],
    parentRoles: [],
    userRoles: [],
  }),
  actions: {
    async fetchRoles() {
      try {
        const response = await axios.get('roles/view')
        if (response.data.success) {
          this.roles = response.data.data
          this.parentRoles = this.roles.filter((role) => role.parent_id === null)
          this.userRoles = this.roles.filter((role) => role.parent_id !== null)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    },
  },
})
