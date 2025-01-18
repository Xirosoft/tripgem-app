import { usePermissionsStore } from '@/stores/permissions' // Ensure this is correctly named and exported

export default {
  methods: {
    async uCan(action, permissionName) {
      const permissionStore = usePermissionsStore()
      if (!permissionStore.permissionsFetched) {
        await permissionStore.fetchPermissions()
      }

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
