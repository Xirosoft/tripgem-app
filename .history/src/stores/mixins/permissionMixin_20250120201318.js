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
  },

  methods: {
    // Check if the user has the specific permission action (read, write, create)
    uCan(action, permissionName) {
      const permissionStore = usePermissionsStore()
      console.log('Checking permission in mixin...')
      // Find the specific permission
      const permission = permissionStore.getPermission(permissionName)
      if (!permission) {
        console.log('Permission not found:', permissionName)
        return false
      }

      console.log('Permission found:', permission)

      // Check actions (read, write, create)
      const actions = action.split('|').map((act) => act.trim())
      console.log('Permission checked:', actions)
      return actions.some((act) => {
        if (act === 'read') {
          return permission.can_read
        } else if (act === 'write') {
          return permission.can_write
        } else if (act === 'create') {
          return permission.can_create
        } else {
          return false
        }
      })
    },
    handlePermissionUpdate(updatedPermissions) {
      console.log('Permissions updated in mixin:', updatedPermissions)
      const permissionStore = usePermissionsStore()
      permissionStore.updatePermissions(updatedPermissions.permissions)
    },
  },
}

export const handlePermissionUpdate = (updatedPermissions) => {
  console.log('Permissions updated in mixin:', updatedPermissions)
  const permissionStore = usePermissionsStore()
  permissionStore.updatePermissions(updatedPermissions.permissions)
}
