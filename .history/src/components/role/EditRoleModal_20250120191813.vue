<script>
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
import { useRolesListStore } from '../../stores/role/RoleStore.js'
import { TgHandlePusherChannel } from '../../utils/pusher'

export default defineComponent({
  name: 'EditRoleModal',
  props: {
    roleId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      modalRoleName: '',
      parentRole: '',
      description: '',
      isLoading: false,
      permissions: [],
      userId: null,
    }
  },
  async mounted() {
    this.userId = useAuthStore().userId
    await Promise.all([this.fetchPermissions(), this.fetchRoleDetails()])
    this.setupPusherListener()
  },
  watch: {
    roleId: 'fetchRoleDetails',
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/view`, {
          headers: config.getHeaders(),
        })
        this.permissions = response.data.data.map((permission) => ({
          ...permission,
          can_read: false,
          can_write: false,
          can_create: false,
        }))
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
    async fetchRoleDetails() {
      try {
        const response = await axios.get(
          `${config.apiUrl}/roles/permissions/mapping/view/${this.roleId}`,
          {
            headers: config.getHeaders(),
          },
        )
        const rolePermissions = response.data.data
        this.permissions = this.permissions.map((permission) => {
          const matched = rolePermissions.find(
            (rp) => rp.permission_id === permission.permission_id,
          )
          return {
            ...permission,
            can_read: matched?.can_read === '1',
            can_write: matched?.can_write === '1',
            can_create: matched?.can_create === '1',
          }
        })
      } catch (error) {
        console.error('Error fetching role details:', error)
      }
    },
    async saveRolePermissions() {
      try {
        const payload = this.permissions.map((permission) => ({
          role_id: this.roleId,
          permission_id: permission.permission_id,
          can_read: permission.can_read,
          can_write: permission.can_write,
          can_create: permission.can_create,
          user_id: this.userId,
          is_active: true,
        }))
        await axios.post(`${config.apiUrl}/roles/permissions/mapping/add`, payload, {
          headers: config.getHeaders(),
        })

        // Trigger real-time update
        TgHandlePusherChannel('permissions-updates', 'update', {
          user_id: this.userId,
          permissions: this.permissions,
        })

        this.toast.success('Permissions updated successfully!')
      } catch (error) {
        this.toast.error('Error saving permissions.')
        console.error('Error saving permissions:', error)
      }
    },
    setupPusherListener() {
      TgHandlePusherChannel('permissions-updates', 'update', (data) => {
        if (data.user_id === this.userId) {
          this.permissions = data.permissions
        }
      })
    },
  },
})
</script>
