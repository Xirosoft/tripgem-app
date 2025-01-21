// stores/permissions.js
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'
import { TgHandlePusherChannel, subscribeToPermissionUpdates } from '../utils/pusher'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    permissionsFetched: false,
  }),
  actions: {
    async fetchPermissions() {
      console.log('Fetching permissions...')
      try {
        const userId = this.$root.$userId
        console.log(userId)

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
          TgHandlePusherChannel('permissions-updates', 'update', { permissions: this.permissions }) // Trigger Pusher update
          subscribeToPermissionUpdates(this.updatePermissions) // Subscribe to real-time updates
        } else {
          console.error('Error fetching permissions: Unsuccessful response')
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
    updatePermissions(newPermissions) {
      this.permissions = newPermissions
    },
  },
  getters: {
    getPermission: (state) => (name) => {
      return state.permissions.find((perm) => perm.name === name) || {}
    },
  },
  persist: true, // Enable persisted state
})
