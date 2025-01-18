import { defineStore } from 'pinia'

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    permissions: [],
    permissionsFetched: false,
  }),
  actions: {
    async fetchPermissions(forceRefresh = false) {
      if (this.permissionsFetched && !forceRefresh) return

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
        } else {
          console.error('Error fetching permissions: Unsuccessful response')
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },

    handlePermissionUpdate(data) {
      // Update permissions state when Pusher broadcasts an update
      this.permissions = data.permissions
      this.permissionsFetched = true
    },
  },
  getters: {
    getPermission: (state) => (name) => {
      return state.permissions.find((perm) => perm.name === name) || {}
    },
  },
  persist: true, // Enable persisted state
})
