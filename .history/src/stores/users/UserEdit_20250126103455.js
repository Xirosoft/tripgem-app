import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useUserEditStore = defineStore('userEdit', {
  state: () => ({
    userData: null,
    isLoading: false,
    message: null,
    messageType: null,
    parentRoles: [],
    userRoles: [],
    filteredUserRoles: [],
    companies: [],
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

    async editUser(userId, userData) {
      try {
        const response = await axios.put(`${config.apiUrl}/users/edit/${userId}`, userData, {
          headers: config.getHeaders(),
        })
        return response.data.message || 'User updated successfully'
      } catch (error) {
        console.error('Failed to update user:', error)
        throw new Error(error.response?.data?.message || 'Failed to update user')
      }
    },
  },

  getters: {
    getParentRoles: (state) => state.parentRoles,
    getUserRoles: (state) => state.userRoles,
    getFilteredUserRoles: (state) => state.filteredUserRoles,
    getCompanies: (state) => state.companies,
  },
})
