import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useUsersListStore = defineStore('usersList', {
  state: () => ({
    users: [],
    roles: [],
    parentRoles: [],
    userRoles: [],
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
        const response = await axios.get(`${config.apiUrl}/roles/list`, {
          headers: config.getHeaders(),
        })
        this.roles = response.data
      } catch (error) {
        console.error('Failed to fetch roles:', error)
        throw new Error('Failed to fetch roles')
      }
    },

    async fetchParentRoles() {
      try {
        const response = await axios.get(`${config.apiUrl}/roles/parent`, {
          headers: config.getHeaders(),
        })
        this.parentRoles = response.data
      } catch (error) {
        console.error('Failed to fetch parent roles:', error)
        throw new Error('Failed to fetch parent roles')
      }
    },

    async fetchUserRoles(parentRoleId) {
      try {
        const response = await axios.get(`${config.apiUrl}/roles/user/${parentRoleId}`, {
          headers: config.getHeaders(),
        })
        this.userRoles = response.data
      } catch (error) {
        console.error('Failed to fetch user roles:', error)
        throw new Error('Failed to fetch user roles')
      }
    },

    async fetchCompanies(roleId) {
      let endpoint = ''
      switch (roleId) {
        case 1:
          endpoint = '/agencies/view'
          break
        case 20:
          endpoint = '/merchants/view'
          break
        case 3:
          endpoint = '/affiliates/view'
          break
        case 4:
          endpoint = '/agency/b2b/view'
          break
        default:
          this.companies = []
          return
      }

      try {
        const response = await axios.get(`${config.apiUrl}${endpoint}`, {
          headers: config.getHeaders(),
        })
        this.companies = response.data
      } catch (error) {
        console.error('Failed to fetch companies:', error)
        throw new Error('Failed to fetch companies')
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

    async editUser(userId, userData) {
      try {
        const response = await axios.put(`/api/users/edit/${userId}`, userData)
        return response.data.message || 'User updated successfully'
      } catch (error) {
        console.error('Failed to update user:', error)
        throw new Error(error.response?.data?.message || 'Failed to update user')
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
    getCompanies: (state) => state.companies,
  },
})
