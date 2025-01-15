import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'

export const useUsersListStore = defineStore('usersList', {
  state: () => ({
    users: [],
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
        const response = await axios.get(`${config.apiUrl}/users/verified`, {
          headers: config.getHeaders(),
        })
        this.users = Array.isArray(response.data) ? response.data : response.data.data
        // Ensure verified field is included
        this.users = this.users.map((user) => ({
          ...user,

          verified: user.is_verified === '1' ? true : false,
        }))
        console.log(users)
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
  },
})
