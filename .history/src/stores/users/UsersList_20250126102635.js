import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useUsersListStore = defineStore('usersList', {
  state: () => ({
    users: [],
    roles: [],
    parentRoles: [],
    userRoles: [],
    filteredUserRoles: [],
    companies: [],
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

    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/users/list`, {
          headers: config.getHeaders(),
        })
        this.users = Array.isArray(response.data) ? response.data : response.data.data
        // Ensure verified field is included
        this.users = this.users.map((user) => ({
          ...user,
          verified: user.is_verified === '1' ? true : false,
        }))
        this.loading = false
        this.setMessage('Users loaded successfully', 'success')
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = error.message || 'Failed to fetch users'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

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

    async fetchCompanies(parentRoleId) {
      let endpoint = ''
      switch (parentRoleId) {
        case '19': // B2B
          endpoint = 'agency/b2b/view'
          break
        case '6': // Merchant
          endpoint = 'merchants/view'
          break
        case '16': // Affiliate
          endpoint = 'affiliates/view'
          break
        case '12': // Agency
          endpoint = 'agencies/view'
          break
        default:
          this.companies = []
          return
      }

      try {
        const response = await axios.get(`${config.apiUrl}/${endpoint}`, {
          headers: config.getHeaders(),
        })
        if (response.data) {
          this.companies = response.data.data
        } else {
          console.error('API Error:', response.data ? response.data.message : 'No data')
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    },

    async deleteUser(userId) {
      try {
        const response = await axios.delete(`${config.apiUrl}/users/delete/${userId}`, {
          headers: config.getHeaders(),
        })
        return response.data.message
      } catch (error) {
        throw new Error('Failed to delete user', error)
      }
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    getUserById: (state) => {
      return (id) => state.users.find((user) => user.user_id === id)
    },
    getAllUsers: (state) => state.users,
    getRoles: (state) => state.roles,
    getParentRoles: (state) => state.parentRoles,
    getUserRoles: (state) => state.userRoles,
    getFilteredUserRoles: (state) => state.filteredUserRoles,
    getCompanies: (state) => state.companies,
  },
})
