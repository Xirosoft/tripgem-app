import { useAuthStore } from '@/stores/auth'
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
      const userId = useAuthStore().userId
      try {
        const response = await axios.get(`${config.apiUrl}/users/list/`, {
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
