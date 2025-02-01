import { useAuthStore } from '@/stores/auth'
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
      const userId = useAuthStore().userId
      try {
        const response = await axios.get(`${config.apiUrl}/roles/view/${userId}`, {
          headers: config.getHeaders(),
        })
        if (response.data.success) {
          this.roles = response.data.data
          this.parentRoles = this.roles.filter((role) => role.parent_id === null)
          this.userRoles = this.roles.filter((role) => role.parent_id !== null)
        }
        console.log('Roles:', this.roles)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    },
    filterUserRoles(parentRoleId) {
      this.filteredUserRoles = this.userRoles.filter((role) => role.parent_id === parentRoleId)
    },
    async fetchCompanies(parentRoleId) {
      const userId = useAuthStore().userId
      let endpoint = ''
      switch (parentRoleId) {
        case '4': // B2B
          endpoint = 'agency/b2b/view'
          break
        case '2': // Merchant
          endpoint = 'merchants/view'
          break
        case '5': // Affiliate
          endpoint = 'affiliates/view'
          break
        case '3': // Agency
          endpoint = 'agencies/view'
          break
        default:
          this.companies = []
          return
      }

      try {
        const response = await axios.get(`${config.apiUrl}/${endpoint}/${userId}`, {
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
    async registerUser(userData) {
      try {
        const response = await axios.post(`${config.apiUrl}/register`, userData, {
          headers: config.getHeaders(),
        })
        return response.data
      } catch (error) {
        console.error('Error registering user:', error)
        throw error
      }
    },
    async assignUserToRole(userId, companyId, roleId, status, parentRoleId) {
      let endpoint = ''
      let body = {}
      switch (parentRoleId) {
        case '4': // B2B
          endpoint = 'b2b/user/add'
          body = {
            b2b_user_id: companyId,
            user_id: userId,
            role_id: roleId,
            status: status,
          }
          break
        case '2': // Merchant
          endpoint = 'merchant/user/add'
          body = {
            merchant_id: companyId,
            user_id: userId,
            role_id: roleId,
            status: status,
          }
          break
        case '5': // Affiliate
          endpoint = 'affiliate/user/add'
          body = {
            affiliate_user_id: companyId,
            user_id: userId,
            role_id: roleId,
            status: status,
          }
          break
        case '3': // Agency
          endpoint = 'agency/user/add'
          body = {
            agency_id: companyId,
            user_id: userId,
            role_id: roleId,
            status: status,
          }
          break
        default:
        // throw new Error('Invalid parent role ID')
      }

      try {
        const response = await axios.post(`${config.apiUrl}/${endpoint}`, body, {
          headers: config.getHeaders(),
        })
        return response.data
      } catch (error) {
        console.error('Error assigning user to role:', error)
        throw error
      }
    },
  },
})
