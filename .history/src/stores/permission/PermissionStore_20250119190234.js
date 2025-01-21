import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'
// import { TgHandlePusherChannel } from '../../utils/pusher' // Import Pusher utility

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
        this.permissions = this.permissions.map((permission) => ({
          ...permission,
          slug: permission.permission_name, // Add slug field
        }))
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

    async addPermission(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${config.apiUrl}/permissions/add`, payload, {
          headers: config.getHeaders(),
        })
        if (response.data.success) {
          this.permissions.push(response.data.data)
          this.setMessage('Permission added successfully', 'success')
          // TgHandlePusherChannel('permissions-updates', 'update', { permissions: this.permissions }) // Trigger Pusher update
        } else {
          this.error = response.data.message || 'Failed to add permission'
          this.setMessage(this.error, 'danger')
        }
        this.loading = false
      } catch (error) {
        console.error('Error adding permission:', error)
        this.error = error.message || 'Failed to add permission'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    async editPermission(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put(`${config.apiUrl}/permissions/edit/${id}`, payload, {
          headers: config.getHeaders(),
        })
        if (response.data.success) {
          const index = this.permissions.findIndex((permission) => permission.permission_id === id)
          if (index !== -1) {
            this.permissions[index] = response.data.data
          }
          this.setMessage('Permission updated successfully', 'success')
          // TgHandlePusherChannel('permissions-updates', 'update', { permissions: this.permissions }) // Trigger Pusher update
        } else {
          this.error = response.data.message || 'Failed to update permission'
          this.setMessage(this.error, 'danger')
        }
        this.loading = false
      } catch (error) {
        console.error('Error updating permission:', error)
        this.error = error.message || 'Failed to update permission'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    async deletePermission(id) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.delete(`${config.apiUrl}/permissions/delete/${id}`, {
          headers: config.getHeaders(),
        })
        if (response.data.success) {
          this.permissions = this.permissions.filter(
            (permission) => permission.permission_id !== id,
          )
          this.setMessage('Permission deleted successfully', 'success')
          // TgHandlePusherChannel('permissions-updates', 'update', { permissions: this.permissions }) // Trigger Pusher update
        } else {
          this.error = response.data.message || 'Failed to delete permission'
          this.setMessage(this.error, 'danger')
        }
        this.loading = false
      } catch (error) {
        console.error('Error deleting permission:', error)
        this.error = error.message || 'Failed to delete permission'
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
