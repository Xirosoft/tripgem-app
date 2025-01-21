// stores/permissions.js
import router from '@/router' // Correct the import path for router
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'
import { subscribeToChannel } from '../utils/pusher' // Import Pusher utility

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

    // Method to handle real-time updates from Pusher
    handlePermissionUpdate(data) {
      console.log('Received permission update:', data)
      this.permissions = data.permissions.map((permission) => ({
        name: permission.name,
        can_read: permission.can_read === '1',
        can_write: permission.can_write === '1',
        can_create: permission.can_create === '1',
      }))
      this.permissionsFetched = true
      console.log('Permissions updated:', this.permissions)

      // Trigger router refresh
      router.replace({
        path: router.currentRoute.value.fullPath,
        query: { refresh: new Date().getTime() },
      })
    },

    // Initialize Pusher for real-time updates
    initializePusher() {
      if (this.pusherInitialized) return

      subscribeToChannel(
        'permissions-updates',
        'client-update',
        this.handlePermissionUpdate.bind(this),
      ) // Ensure the event name is prefixed with 'client-'
      this.pusherInitialized = true
    },
  },
  getters: {
    getPermission: (state) => (name) => {
      return state.permissions.find((perm) => perm.name === name) || {}
    },
  },
  persist: true, // Enable persisted state
})
