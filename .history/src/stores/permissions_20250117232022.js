// stores/permissions.js
import { defineStore } from 'pinia'
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    async fetchPermissions() {
      try {
        const response = await fetch('https://api.example.com/permissions') // Replace with your API URL
        const data = await response.json()
        this.permissions = data
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
