// mixins/PermissionMixin.js
import { usePermissionsStore } from '@/stores/permissions'

export default {
  async created() {
    const permissionStore = usePermissionsStore()
    if (!permissionStore.permissionsFetched) {
      await permissionStore.fetchPermissions()
    }
  },
  methods: {
    async uCan(action, permissionName) {
      const permissionStore = usePermissionsStore()

      // Ensure permissions are loaded
      if (!permissionStore.permissionsFetched) {
        await permissionStore.fetchPermissions()
      }

      // Find the specific permission
      const permission = permissionStore.getPermission(permissionName)
      if (!permission) return false

      // Check actions
      const actions = action.split('|').map((act) => act.trim())
      return actions.some((act) => {
        return act === 'read'
          ? permission.can_read
          : act === 'write'
            ? permission.can_write
            : act === 'create'
              ? permission.can_create
              : false
      })
    },
  },
}
