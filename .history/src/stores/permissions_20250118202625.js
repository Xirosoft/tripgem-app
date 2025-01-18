// stores/permissions.js
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    permissionsFetched: false,
    lastFetched: null, // Timestamp of last fetch
  }),
  actions: {
    async fetchPermissions(forceRefresh = false) {
      const staleThreshold = 1000 * 60 * 5 // 5 minutes
      const now = Date.now()

      if (
        !forceRefresh &&
        this.permissionsFetched &&
        this.lastFetched &&
        now - this.lastFetched < staleThreshold
      ) {
        console.log('Permissions are fresh. No need to fetch.')
        return
      }

      try {
        const userId = useAuthStore().userId
        const response = await axios.get(`${config.apiUrl}/permissions/user/${userId}`, {
          headers: config.getHeaders(),
        })

        if (response.data.success) {
          this.permissions = response.data.data.map((permission) => ({
            name: permission.name,
            can_read: permission.can_read === '1',
            can_write: permission.can_write === '1',
            can_create: permission.can_create === '1',
          }))
          this.permissionsFetched = true
          this.lastFetched = now
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
