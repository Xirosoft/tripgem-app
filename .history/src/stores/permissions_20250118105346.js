// stores/permissions.js
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../config/config'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    async fetchPermissions() {
      try {
        const userId = useAuthStore().userId
        const response = await axios.get(`${config.apiUrl}/permissions/user/${userId}`, {
          headers: config.getHeaders(),
        }) // Replace with your API URL
        // console.log('Response:', response)

        if (response.data.success) {
          this.permissions = response.data.map((permission) => ({
            name: permission.name,
            can_read: permission.can_read === '1',
            can_write: permission.can_write === '1',
            can_create: permission.can_create === '1',
          }))
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
})
