// stores/permissions.js
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'
import { useAuthStore } from '@/stores/auth'
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    const userId = useAuthStore().userId
    async fetchPermissions(userId) {
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/user/${userId}`) // Replace with your API URL
        if (response.data.success) {
          this.permissions = response.data.data
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
