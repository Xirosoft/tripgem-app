// mixins/PermissionMixin.js
import { usePermissionsStore } from '@/stores/permissions'
import { bindPusherEvents } from '@/utils/pusher'

export default {
  async created() {
    const permissionStore = usePermissionsStore()

    // Fetch initial permissions if not already fetched
    if (!permissionStore.permissionsFetched) {
      // console.log('Fetching initial permissions...')
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
      const permission = permissionStore.getPermission(permissionName)

      if (!permission) {
        return false
      }

      // Split the action string into individual actions
      const actions = action.split('|').map((act) => act.trim())

      console.log('Checking permission:', permissionName, 'for actions:', actions)
      console.log('Permission:', permission)

      // Check if any of the requested actions are allowed
      return actions.some((act) => {
        console.log('Checking action:', act)

        switch (act) {
          case 'read':
            if (
              permission.can_read === 1 ||
              permission.can_write === 1 ||
              permission.can_create === 1
            ) {
              return true
            } else if (permission.can_read === 0) {
              return false
            }
            break
          case 'write':
            if (permission.can_write === 1) {
              return true
            } else if (permission.can_write === 0) {
              return false
            }
            break
          case 'create':
            if (permission.can_create === 1) {
              return true
            } else if (permission.can_create === 0) {
              return false
            }
            break
          default:
            return true
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
