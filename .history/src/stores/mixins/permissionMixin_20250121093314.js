// mixins/PermissionMixin.js
import { usePermissionsStore } from '@/stores/permissions'
// import { bindPusherEvents } from '@/utils/pusher'

export default {
  async created() {
    const permissionStore = usePermissionsStore()

    // Fetch initial permissions if not already fetched
    if (!permissionStore.permissionsFetched) {
      // console.log('Fetching initial permissions...')
      await permissionStore.fetchPermissions()
    }
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

      // Check if any of the requested actions are allowed
      return actions.some((act) => {
        console.log('Checking action:', act)

        switch (act) {
          case 'read':
            if (parseInt(permission.can_read) === 1 || permission.can_read === true) {
              console.log('Read permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('Read permission denied: User lacks required access')
              return false
            }
          case 'write':
            console.log('Checking write permission:', permission.can_write)

            if (parseInt(permission.can_write) === 1 || permission.can_write === true) {
              console.log('write permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('write permission denied: User lacks required access')
              return false
            }
          case 'create':
            if (parseInt(permission.can_create) === 1 || permission.can_create === true) {
              console.log('createß permission granted: User has read, write, or create access')
              return true
            } else {
              console.log('createß permission denied: User lacks required access')
              return false
            }
          default:
            console.log('Unknown permission action:', act)
            return true
        }
      })
    },
  },
}

export const handlePermissionUpdateMixin = (updatedPermissions) => {
  const permissionStore = usePermissionsStore()
  permissionStore.updatePermissions(updatedPermissions.permissions)
}
