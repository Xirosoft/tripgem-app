import { usePermissionsStore } from '@/stores/permissions' // Ensure this is correctly named and exported

export default {
  data() {
    return {
      permissionsFetched: false,
    }
  },
  methods: {
    async fetchPermissionsOnce() {
      const permissionStore = usePermissionsStore()
      if (!this.permissionsFetched) {
        await permissionStore.fetchPermissions()
        this.permissionsFetched = true
      }
    },
    async uCan(action, permissionName) {
      await this.fetchPermissionsOnce()
      const permissionStore = usePermissionsStore()
      const permission = permissionStore.permissions.find((perm) => perm.name === permissionName)
      if (!permission) return false

      const actions = action.split('|').map((act) => act.trim())
      return actions.some((act) => {
        if (act === 'read') return permission.can_read
        if (act === 'write') return permission.can_write
        if (act === 'create') return permission.can_create
        return false
      })
    },
  },
}
