import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useNewUserModal = defineStore('newUserModal', {
  state: () => ({
    roles: [],
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
        console.log('API Response:', response)
        if (response.data) {
          this.companies = response.data.data
        } else {
          console.error('API Error:', response.data ? response.data.message : 'No data')
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    },
  },
})
