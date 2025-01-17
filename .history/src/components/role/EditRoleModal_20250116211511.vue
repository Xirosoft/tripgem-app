<script>
import { defineComponent } from 'vue'
import { useRolesListStore } from '../../stores/role/RoleStore.js'

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
      message: '',
      messageType: '',
    }
  },
  async mounted() {
    await this.fetchRoleDetails()
    this.setupSelectAllCheckbox()
  },
  watch: {
    roleId: 'fetchRoleDetails',
  },
  methods: {
    async fetchRoleDetails() {
      const rolesListStore = useRolesListStore()
      const role = rolesListStore.getRoleById(this.roleId)
      if (role) {
        this.modalRoleName = role.role_name
        this.parentRole = role.parent_id
        this.description = role.description
      }
    },
    async editRole() {
      this.isLoading = true
      this.message = ''
      const payload = {
        role_name: this.modalRoleName,
        parent_id: this.parentRole,
        description: this.description,
      }
      const rolesListStore = useRolesListStore()
      try {
        await rolesListStore.editRole(this.roleId, payload)
        if (!rolesListStore.error) {
          this.message = 'Role updated successfully'
          this.messageType = 'success'
          // Optionally, close the modal
          // this.$refs.editRoleModal.hide()
          // Update the roles list
          await rolesListStore.fetchRoles()
        } else {
          this.message = rolesListStore.error
          this.messageType = 'danger'
        }
      } catch (error) {
        this.message = 'Error updating role'
        this.messageType = 'danger'
        console.error('Error updating role:', error)
      } finally {
        this.isLoading = false
      }
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
                    <tr>
                      <td class="text-nowrap fw-medium text-heading">User Management</td>
                      <td>
                        <div class="d-flex justify-content-end">
                          <div class="form-check mb-0 me-4 me-lg-12">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="userManagementRead"
                            />
                            <label class="form-check-label" for="userManagementRead"> Read </label>
                          </div>
                          <div class="form-check mb-0 me-4 me-lg-12">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="userManagementWrite"
                            />
                            <label class="form-check-label" for="userManagementWrite">
                              Write
                            </label>
                          </div>
                          <div class="form-check mb-0">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="userManagementCreate"
                            />
                            <label class="form-check-label" for="userManagementCreate">
                              Create
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
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
                <span v-if="!isLoading">Update Role</span>
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
