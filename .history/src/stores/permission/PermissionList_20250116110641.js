import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const usePermissionStore = defineStore('PermissionsList', {
  state: () => ({
    users: [],
    roles: [],
    permissions: [], // Add permissions to state
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

    async fetchPermissions() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/view`, {
          headers: config.getHeaders(),
        })
        this.permissions = Array.isArray(response.data) ? response.data : response.data.data
        this.loading = false
        this.setMessage('Permissions loaded successfully', 'success')
      } catch (error) {
        console.error('Error fetching permissions:', error)
        this.error = error.message || 'Failed to fetch permissions'
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
