import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useUserEditStore = defineStore('userEdit', {
  state: () => ({
    userData: null,
    roleName: '',
    companyName: '',
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

    async fetchUserDetails(userId) {
      try {
        const response = await axios.get(`${config.apiUrl}/users/details/${userId}`, {
          headers: config.getHeaders(),
        })

        if (response.data.success) {
          // console.log(response.data.data.role_name)

          this.userData = response.data.data.user
          this.roleName = response.data.data.role_name
          this.companyName = response.data.data.company_name
          this.userData.meta = response.data.data.usermeta || {}
          this.userData.meta.location = this.userData.meta.location || ''
          this.userData.meta.profile_picture = this.userData.meta.profile_picture || ''
          this.userData.meta.cover_photo = this.userData.meta.cover_photo || ''
          this.userData.meta.language = this.userData.meta.language || ''
          this.userData.meta.social_links = this.userData.meta.social_links || {
            twitter: '',
            facebook: '',
            line: '',
            linkedin: '',
            instagram: '',
            tiktok: '',
          }
          this.userData.meta.bio = this.userData.meta.bio || ''

          if (response.data.data.affiliate_data) {
            this.userData.company_id = response.data.data.affiliate_data.affiliate_id
            this.userData.parent_role_id = '5'
          } else if (response.data.data.agency_data) {
            this.userData.company_id = response.data.data.agency_data.agency_id
            this.userData.parent_role_id = '3'
          } else if (response.data.data.b2b_data) {
            this.userData.company_id = response.data.data.b2b_data.b2b_id
            this.userData.parent_role_id = '4'
          } else if (response.data.data.merchant_data) {
            this.userData.company_id = response.data.data.merchant_data.merchant_id
            this.userData.parent_role_id = '2'
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
        throw new Error('Failed to fetch user details')
      }
    },

    async editUser(userId, userData) {
      const payload = {
        email: userData.email,
        phone_number: userData.phone_number,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role_id: userData.role_id,
        status: userData.status,
        meta: {
          location: userData.meta.location,
          profile_picture: userData.meta.profile_picture,
          cover_photo: userData.meta.cover_photo,
          language: userData.meta.language,
          social_links: userData.meta.social_links,
          bio: userData.meta.bio,
        },
      }

      if (userData.parent_role_id === '5') {
        // Affiliate
        payload.affiliate_data = {
          affiliate_id: userData.company_id,
          role_id: userData.role_id,
          status: userData.status,
        }
      } else if (userData.parent_role_id === '3') {
        // Agency
        payload.agency_data = {
          agency_id: userData.company_id,
          role_id: userData.role_id,
          status: userData.status,
        }
      } else if (userData.parent_role_id === '4') {
        // B2B
        payload.b2b_data = {
          b2b_id: userData.company_id,
          role_id: userData.role_id,
          status: userData.status,
        }
      } else if (userData.parent_role_id === '2') {
        // Merchant
        payload.merchant_data = {
          merchant_id: userData.company_id,
          role_id: userData.role_id,
          status: userData.status,
        }
      }

      try {
        const response = await axios.put(`${config.apiUrl}/users/edit/${userId}`, payload, {
          headers: config.getHeaders(),
        })
        console.log(payload)

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
