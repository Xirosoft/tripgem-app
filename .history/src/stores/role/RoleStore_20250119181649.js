import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'
import { TgHandlePusherChannel } from '../../utils/pusher' // Import Pusher utility

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
      try {
        const response = await axios.get(`${config.apiUrl}/roles/count/${roleId}`, {
          headers: config.getHeaders(),
        })
        return response.data.count
      } catch (error) {
        console.error('Error fetching user count:', error)
        throw error
      }
    },

    async createRole(roleData) {
      this.loading = true
      this.clearMessage()
      try {
        const response = await axios.post(`${config.apiUrl}/roles/add`, roleData, {
          headers: config.getHeaders(),
        })
        this.roles.push(response.data) // Ensure the correct data is pushed to roles
        this.setMessage('Role created successfully', 'success')
        TgHandlePusherChannel('roles-updates', 'update', { roles: this.roles }) // Trigger Pusher update
        return response.data // Return the response data
      } catch (error) {
        console.error('Error creating role:', error)
        this.error = error.message || 'Failed to create role'
        this.setMessage(this.error, 'danger')
        throw error
      } finally {
        this.loading = false
      }
    },

    async editRole(roleId, roleData) {
      this.loading = true
      this.clearMessage()
      try {
        const response = await axios.put(`${config.apiUrl}/roles/edit/${roleId}`, roleData, {
          headers: config.getHeaders(),
        })
        const index = this.roles.findIndex((role) => role.role_id === roleId)
        if (index !== -1) {
          this.roles[index] = response.data
        }
        this.setMessage('Role updated successfully', 'success')
        TgHandlePusherChannel('roles-updates', 'update', { roles: this.roles }) // Trigger Pusher update
      } catch (error) {
        console.error('Error updating role:', error)
        this.error = error.message || 'Failed to update role'
        this.setMessage(this.error, 'danger')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRole(roleId) {
      this.loading = true
      this.clearMessage()
      try {
        // Delete permission mappings for the role
        await axios.delete(`${config.apiUrl}/roles/permissions/mapping/delete/${roleId}`, {
          headers: config.getHeaders(),
        })
        // Delete the role
        await axios.delete(`${config.apiUrl}/roles/delete/${roleId}`, {
          headers: config.getHeaders(),
        })
        this.roles = this.roles.filter((role) => role.role_id !== roleId)
        this.setMessage('Role and its permissions deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting role:', error)
        this.error = error.message || 'Failed to delete role'
        this.setMessage(this.error, 'danger')
        throw error
      } finally {
        this.loading = false
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
      const role = state.roles.find((r) => r.role_id === roleId)
      return role ? role.user_count || 0 : 0
    },
    getRoleById: (state) => (roleId) => {
      return state.roles.find((role) => role.role_id === roleId)
    },
  },
})
