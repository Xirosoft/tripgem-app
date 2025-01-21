<script>
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'
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

<template>
  <div
    class="modal fade"
    id="editRoleModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="offcanvasEditRoleLabel"
    ref="editRoleModal"
  >
    <div class="modal-dialog modal-lg modal-simple modal-dialog-centered modal-edit-role">
      <div class="modal-content">
        <div class="modal-body">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="text-center mb-6">
            <h4 class="role-title mb-2" id="offcanvasEditRoleLabel">Edit Role</h4>
            <p>Set role permissions</p>
          </div>
          <!-- Edit role form -->
          <form id="editRoleForm" class="row g-6" @submit.prevent="editRole">
            <div class="col-12">
              <label class="form-label" for="modalRoleName">Role Name</label>
              <input
                type="text"
                id="modalRoleName"
                name="modalRoleName"
                v-model="modalRoleName"
                class="form-control"
                placeholder="Enter a role name"
                tabindex="-1"
              />
              <span class="text-danger">{{ modalRoleNameError }}</span>
            </div>
            <div class="col-md-12 mb-6">
              <label for="select2Basic" class="form-label">Select Parent Role</label>
              <select
                id="select2Basic"
                class="select2 form-select form-select-lg"
                data-allow-clear="true"
                name="parentRole"
                v-model="parentRole"
              >
                <option value="1">Super Admin</option>
                <option value="6">Merchant</option>
                <option value="12">Agency</option>
                <option value="16">Affiliate</option>
                <option value="19">B2B</option>
              </select>
            </div>
            <div class="col-12">
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                spellcheck="false"
                v-model="description"
              ></textarea>
            </div>
            <div class="col-12">
              <h5 class="mb-6">Role Permissions</h5>
              <!-- Permission table -->
              <div class="table-responsive">
                <table class="table table-flush-spacing">
                  <tbody>
                    <tr>
                      <td class="text-nowrap fw-medium text-heading">
                        Administrator Access
                        <i
                          class="ti ti-info-circle"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Allows a full access to the system"
                        ></i>
                      </td>
                      <td>
                        <div class="d-flex justify-content-end">
                          <div class="form-check mb-0">
                            <input class="form-check-input" type="checkbox" id="selectAll" />
                            <label class="form-check-label" for="selectAll"> Select All </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Permission list -->
                    <tr v-for="permission in permissions" :key="permission.permission_id">
                      <td class="text-nowrap fw-medium text-heading">
                        {{ permission.permission_name }}
                      </td>
                      <td>
                        <div class="d-flex justify-content-end">
                          <div class="form-check mb-0 me-4 me-lg-12">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`edit_${permission.permission_name}_read`"
                            />
                            <label
                              class="form-check-label"
                              :for="`edit_${permission.permission_name}_read`"
                            >
                              Read
                            </label>
                          </div>
                          <div class="form-check mb-0 me-4 me-lg-12">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`edit_${permission.permission_name}_write`"
                            />
                            <label
                              class="form-check-label"
                              :for="`edit_${permission.permission_name}_write`"
                            >
                              Write
                            </label>
                          </div>
                          <div class="form-check mb-0">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`edit_${permission.permission_name}_create`"
                            />
                            <label
                              class="form-check-label"
                              :for="`edit_${permission.permission_name}_create`"
                            >
                              Create
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- end permission list -->
                  </tbody>
                </table>
              </div>
              <!-- Permission table -->
            </div>
            <div class="col-12 text-center">
              <button type="submit" class="btn btn-primary me-3" :disabled="isLoading">
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Update Role</span>
              </button>
              <button
                type="reset"
                class="btn btn-label-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Cancel
              </button>
            </div>
          </form>
          <!--/ Edit role form -->
          <div v-if="message" :class="`alert alert-${messageType} mt-4`" role="alert">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
