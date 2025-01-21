// stores/permissions.js
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    permissionsFetched: false,
    pusherInitialized: false, // Track if Pusher is initialized
  }),
  actions: {
    // Fetch the permissions from the API
    async fetchPermissions() {
      console.log('Fetching permissions...')

      try {
        const userId = useAuthStore().userId
        const response = await axios.get(`${config.apiUrl}/permissions/user/${userId}`, {
          headers: config.getHeaders(),
        }) // Replace with your API URL
        console.log('Response:', response.data)

        if (response.data.success) {
          this.permissions = response.data.data.map((permission) => ({
            name: permission.name,
            can_read: permission.can_read === '1',
            can_write: permission.can_write === '1',
            can_create: permission.can_create === '1',
          }))
          this.permissionsFetched = true
          console.log('Permissions fetched:', this.permissions)
        } else {
          console.error('Error fetching permissions: Unsuccessful response')
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
  },
  getters: {
    getPermission: (state) => (name) => {
      return state.permissions.find((perm) => perm.name === name) || {}
    },
  },
  persist: true, // Enable persisted state
})
