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
      return false
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
