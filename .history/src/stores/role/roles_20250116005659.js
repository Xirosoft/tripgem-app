import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useRolesListStore = defineStore('rolesList', {
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
        const response = await axios.get(`${config.apiUrl}/roles/view`, {
          headers: config.getHeaders(),
        })
        this.roles = Array.isArray(response.data) ? response.data : response.data.data
        await this.fetchUserCounts() // Fetch user counts for each role
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

    async fetchUserCounts() {
      try {
        const rolesWithCounts = await Promise.all(
          this.roles.map(async (role) => {
            const response = await axios.get(`${config.apiUrl}/roles/count/${role.role_id}`, {
              headers: config.getHeaders(),
            })
            return {
              ...role,
              user_count: response.data.count,
            }
          }),
        )
        this.roles = rolesWithCounts
      } catch (error) {
        console.error('Error fetching user counts:', error)
        this.error = error.message || 'Failed to fetch user counts'
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
