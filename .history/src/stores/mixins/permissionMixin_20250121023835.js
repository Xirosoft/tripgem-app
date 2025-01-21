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
            if (parseInt(permission.can_read) === 1) {
              console.log('Read permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('Read permission denied: User lacks required access')
              return false
            }
          case 'write':
            console.log('Checking write permission:', permission.can_write)

            if (parseInt(permission.can_write) === 1) {
              console.log('Read permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('Read permission denied: User lacks required access')
              return false
            }
          case 'create':
            if (parseInt(permission.can_create) === 1) {
              console.log('Read permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('Read permission denied: User lacks required access')
              return false
            }
          default:
            console.log('Unknown permission action:', act)
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
