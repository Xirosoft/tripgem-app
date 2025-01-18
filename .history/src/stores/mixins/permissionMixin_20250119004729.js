// mixins/PermissionMixin.js
import { usePermissionsStore } from '@/stores/permissions'

export default {
  async created() {
    const permissionStore = usePermissionsStore()

    // Fetch initial permissions if not already fetched
    if (!permissionStore.permissionsFetched) {
      await permissionStore.fetchPermissions()
    }

    // Initialize Pusher to listen for permission updates
    permissionStore.initializePusher()
  },

  methods: {
    // Check if the user has the specific permission action (read, write, create)
    uCan(action, permissionName) {
      const permissionStore = usePermissionsStore()

      // Find the specific permission
      const permission = permissionStore.getPermission(permissionName)
      if (!permission) return false

      // Check actions (read, write, create)
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
