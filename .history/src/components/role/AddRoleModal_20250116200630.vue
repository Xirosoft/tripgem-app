<script>
import { useField, useForm } from 'vee-validate'
import { defineComponent } from 'vue'
import * as yup from 'yup'
import { useRolesListStore } from '../../stores/role/RoleStore.js'

export default defineComponent({
  name: 'AddRoleModal',
  data() {
    return {
      modalRoleName: '',
      modalRoleNameError: '',
      parentRole: '',
      loading: false,
      message: '',
      messageType: '',
    }
  },
  setup() {
    const rolesListStore = useRolesListStore()
    rolesListStore.fetchRoles()
    rolesListStore.loading = false
    const { handleSubmit } = useForm({
      validationSchema: yup.object({
        modalRoleName: yup.string().required('Please enter role name'),
      }),
    })

    const { value: modalRoleName, errorMessage: modalRoleNameError } = useField('modalRoleName')
    const { value: parentRole } = useField('parentRole')

    const onSubmit = handleSubmit(async (values, { resetForm }) => {
      rolesListStore.loading = true
      rolesListStore.clearMessage()
      try {
        await rolesListStore.createRole({
          role_name: values.modalRoleName,
          parent_id: parentRole.value,
          description: 'example_role_name',
        })
        rolesListStore.setMessage('Role created successfully', 'success')
        resetForm()
      } catch (error) {
        console.error(error)
        rolesListStore.setMessage('Failed to create role', 'danger')
      } finally {
        rolesListStore.loading = false
      }
    })
  },
  mounted() {
    this.setupSelectAllCheckbox()
  },
  methods: {
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
          <form id="addRoleForm" class="row g-6" @submit.prevent="onSubmit">
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
              <button type="submit" class="btn btn-primary me-3" :disabled="loading">
                <span
                  v-if="loading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span v-if="!loading">Create Role</span>
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
          <div v-if="message" :class="`alert alert-${messageType}`" role="alert">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
