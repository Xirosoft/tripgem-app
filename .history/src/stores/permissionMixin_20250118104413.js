import axios from 'axios'
import { defineStore } from 'pinia'

export const usePermissionStore = defineStore('permissionStore', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    async fetchPermissions() {
      try {
        const response = await axios.get('/wp-json/tripgem/v1/permissions/view')
        this.permissions = response.data.map((permission) => ({
          name: permission.name,
          can_read: permission.can_read === '1',
          can_write: permission.can_write === '1',
          can_create: permission.can_create === '1',
        }))
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
  },
})
