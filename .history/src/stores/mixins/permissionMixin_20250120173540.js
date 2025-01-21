// mixins/PermissionMixin.js
import { usePermissionsStore } from '@/stores/permissions'
import { bindPusherEvents } from '@/utils/pusher'

export default {
  async created() {
    const permissionStore = usePermissionsStore()

    // Fetch initial permissions if not already fetched
    if (!permissionStore.permissionsFetched) {
      console.log('Fetching initial permissions...')
      await permissionStore.fetchPermissions()
    }

    // Initialize Pusher to listen for permission updates
    console.log('Initializing Pusher in mixin...')
    permissionStore.initializePusher()
    bindPusherEvents(this.handlePermissionUpdate)
    console.log('Pusher initialized in mixin', bindPusherEvents(this.handlePermissionUpdate))
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
    handlePermissionUpdate(updatedPermissions) {
      const permissionStore = usePermissionsStore()
      permissionStore.updatePermissions(updatedPermissions.permissions)
    },
  },
}
