import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useNewUserModal = defineStore('newUserModal', {
  state: () => ({
    roles: [],
    parentRoles: [],
    userRoles: [],
    filteredUserRoles: [],
  }),
  actions: {
    async fetchRoles() {
      try {
        const response = await axios.get(`${config.apiUrl}/roles/view`, {
          headers: config.getHeaders(),
        })
        if (response.data.success) {
          this.roles = response.data.data
          this.parentRoles = this.roles.filter((role) => role.parent_id === null)
          this.userRoles = this.roles.filter((role) => role.parent_id !== null)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    },
    filterUserRoles(parentRoleId) {
      this.filteredUserRoles = this.userRoles.filter((role) => role.parent_id === parentRoleId)
    },
  },
})
