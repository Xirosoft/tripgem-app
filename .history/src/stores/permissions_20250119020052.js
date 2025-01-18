// stores/permissions.js
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
// import Pusher from 'pusher-js' // Import Pusher
import config from '../config/config'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    permissionsFetched: false,
  }),
  actions: {
    // Fetch the permissions from the API
    async fetchPermissions() {
      console.log('Fetching permissions...')

      if (this.permissionsFetched) return

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
      this.permissions = data.permissions
      this.permissionsFetched = true
      console.log('Permissions updated:', this.permissions)
    },

    // Initialize Pusher for real-time updates
    initializePusher() {
      console.log('Initializing Pusher...')

      const pusher = new Pusher('21a8e898a0d7e6578c45', {
        // Replace with your Pusher app key
        cluster: 'ap1', // Ensure this matches your Pusher cluster
        forceTLS: true,
        enabledTransports: ['ws', 'wss', 'xhr_streaming', 'xhr_polling'], // Enable HTTP fallback
      })

      const channel = pusher.subscribe('permissions-updates') // Channel name to listen to

      // Bind to 'pusher:subscription_succeeded' event
      channel.bind('pusher:subscription_succeeded', () => {
        console.log('Pusher subscription succeeded')
      })

      // Bind to 'update' event
      channel.bind('update', (data) => {
        console.log('Pusher update event received')
        this.handlePermissionUpdate(data) // Call the update handler
      })

      // Bind to 'pusher:subscription_error' event
      channel.bind('pusher:subscription_error', (status) => {
        console.error('Pusher subscription error:', status)
      })
    },
  },
  getters: {
    getPermission: (state) => (name) => {
      return state.permissions.find((perm) => perm.name === name) || {}
    },
  },
  persist: true, // Enable persisted state
})
