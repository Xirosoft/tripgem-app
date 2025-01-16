import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const usePermissionStore = defineStore('PermissionsList', {
  state: () => ({
    users: [],
    roles: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    async fetchRoles() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/view`, {
          headers: config.getHeaders(),
        })
        this.roles = Array.isArray(response.data) ? response.data : response.data.data

        // Fetch user counts for each role
        await Promise.all(
          this.roles.map(async (role) => {
            const count = await this.fetchUserCount(role.role_id)
            role.user_count = count // Add user_count to each role
          }),
        )

        this.loading = false
        this.setMessage('Roles loaded successfully', 'success')
      } catch (error) {
        console.error('Error fetching roles:', error)
        this.error = error.message || 'Failed to fetch roles'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    getAllRoles: (state) => state.roles,
  },
})
