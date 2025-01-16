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

    async fetchUserCount(roleId) {
      // console.log('Fetching user count for role:', roleId) // eslint-disable-line;

      try {
        const response = await axios.get(`${config.apiUrl}/roles/count/${roleId}`, {
          headers: config.getHeaders(),
        })
        console.log('User count:', response.data.count) // eslint-disable-line;
        return response.data.count
      } catch (error) {
        console.error('Error fetching user count:', error)
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
    getUserCount: (state) => (roleId) => {
      console.log('Getting user count for role:', roleId) // eslint-disable-line;

      const role = state.roles.find((r) => r.role_id === roleId)
      return role ? role.user_count || 0 : 0
    },
  },
})
