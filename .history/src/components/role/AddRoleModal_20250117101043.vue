<script>
import axios from 'axios'
import { defineComponent } from 'vue'
import config from '../../config/config'
import { useRolesListStore } from '../../stores/role/RoleStore.js'

export default defineComponent({
  name: 'AddRoleModal',
  data() {
    return {
      modalRoleName: '',
      parentRole: '',
      description: '',
      isLoading: false,
      message: '',
      messageType: '',
      permissions: [],
    }
  },
  async mounted() {
    this.setupSelectAllCheckbox()
    await this.fetchPermissions()
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/view`, {
          headers: config.getHeaders(),
        })
        this.permissions = Array.isArray(response.data) ? response.data : response.data.data
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
    async mapRolePermissions(roleId, permissions) {
      try {
        const userId = 1 // Replace with actual user ID if available
        for (const permission of permissions) {
          const payload = {
            role_id: roleId,
            permission_id: permission.permission_id,
            can_read: document.getElementById(`${permission.permission_name}_read`).checked,
            can_write: document.getElementById(`${permission.permission_name}_write`).checked,
            can_create: document.getElementById(`${permission.permission_name}_create`).checked,
            is_active: true,
            user_id: userId,
          }
          await axios.post(`${config.apiUrl}/roles/permissions/mapping/add`, payload, {
            headers: config.getHeaders(),
          })
          console.log('Mapped role permissions:', payload)
        }
      } catch (error) {
        console.error('Error mapping role permissions:', error)
      }
    },
    async addRole() {
      this.isLoading = true
      this.message = ''
      const payload = {
        role_name: this.modalRoleName,
        parent_id: this.parentRole,
        description: this.description,
        permissions: this.permissions.map((permission) => ({
          permission_id: permission.permission_id,
          read: document.getElementById(`${permission.permission_name}_read`).checked,
          write: document.getElementById(`${permission.permission_name}_write`).checked,
          create: document.getElementById(`${permission.permission_name}_create`).checked,
        })),
      }
      const rolesListStore = useRolesListStore()
      try {
        const response = await rolesListStore.createRole(payload)
        console.log(payload)
        console.log(response)

        if (response && response.success) {
          const roleId = response.data.role_id // Ensure role_id is correctly retrieved
          await this.mapRolePermissions(roleId, this.permissions)
          this.message = 'Role created successfully'
          this.messageType = 'success'
          // Clear the form fields
          this.modalRoleName = ''
          this.parentRole = ''
          this.description = ''
          // Optionally, close the modal
          // this.$refs.addRoleModal.hide()
          // Update the roles list
          await rolesListStore.fetchRoles()
        } else {
          this.message = rolesListStore.error || 'Error creating role'
          this.messageType = 'danger'
        }
        this.hideMessageAfterDelay()
      } catch (error) {
        this.message = 'Error adding role'
        this.messageType = 'danger'
        console.error('Error adding role:', error)
        this.hideMessageAfterDelay()
      } finally {
        this.isLoading = false
      }
    },
    hideMessageAfterDelay() {
      setTimeout(() => {
        this.message = ''
        this.messageType = ''
      }, 3000)
    },
    setupSelectAllCheckbox() {
      const selectAll = document.querySelector('#selectAll')
      const checkboxList = document.querySelectorAll('[type="checkbox"]')
      selectAll.addEventListener('change', (t) => {
        checkboxList.forEach((e) => {
          e.checked = t.target.checked
        })
      })
    },
  },
})
</script>

<template>
  <div
    class="modal fade"
    id="addRoleModal"
    tabindex="-1"
    aria-hidden="true"
    aria-labelledby="offcanvasAddRoleLabel"
    ref="addRoleModal"
  >
    <div class="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-role">
      <div class="modal-content">
        <div class="modal-body">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="text-center mb-6">
            <h4 class="role-title mb-2" id="offcanvasAddRoleLabel">Add New Role</h4>
            <p>Set role permissions</p>
          </div>
          <!-- Add role form -->
          <form id="addRoleForm" class="row g-6" @submit.prevent="addRole">
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
                <option value="1" selected>Super Admin</option>
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
                              :id="`${permission.permission_name}_read`"
                            />
                            <label
                              class="form-check-label"
                              :for="`${permission.permission_name}_read`"
                            >
                              Read
                            </label>
                          </div>
                          <div class="form-check mb-0 me-4 me-lg-12">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`${permission.permission_name}_write`"
                            />
                            <label
                              class="form-check-label"
                              :for="`${permission.permission_name}_write`"
                            >
                              Write
                            </label>
                          </div>
                          <div class="form-check mb-0">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              :id="`${permission.permission_name}_create`"
                            />
                            <label
                              class="form-check-label"
                              :for="`${permission.permission_name}_create`"
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
                <span v-if="!isLoading">Create Role</span>
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
          <!--/ Add role form -->
          <div v-if="message" :class="`alert alert-${messageType} mt-4`" role="alert">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
