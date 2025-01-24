<script>
import { useNewUserModal } from '../../stores/users/NewUserModal.js'

export default {
  name: 'NewUserModal',
  setup() {
    const newUserModalStore = useNewUserModal()

    newUserModalStore.fetchRoles()

    return {
      newUserModalStore,
    }
  },
  methods: {
    async onParentRoleChange(event) {
      const parentRoleId = event.target.value
      this.newUserModalStore.filterUserRoles(parentRoleId)
      await this.newUserModalStore.fetchCompanies(parentRoleId)
      console.log(newUserModalStore)
    },
  },
}
</script>

<template>
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasAddUser"
    aria-labelledby="offcanvasAddUserLabel"
  >
    <div class="offcanvas-header border-bottom">
      <h5 id="offcanvasAddUserLabel" class="offcanvas-title">Add User</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body mx-0 flex-grow-0 p-6 h-100">
      <form class="add-new-user pt-0" id="addNewUserForm" onsubmit="return false">
        <div class="mb-6">
          <label class="form-label" for="add-user-fullname">First Name</label>
          <input
            type="text"
            class="form-control"
            id="add-user-fullname"
            placeholder="John Doe"
            name="userFullname"
            aria-label="John Doe"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="add-user-fullname">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="add-user-fullname"
            placeholder="John Doe"
            name="userFullname"
            aria-label="John Doe"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="add-user-email">Email</label>
          <input
            type="text"
            id="add-user-email"
            class="form-control"
            placeholder="john.doe@example.com"
            aria-label="john.doe@example.com"
            name="userEmail"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="add-user-contact">Phone</label>
          <input
            type="text"
            id="add-user-contact"
            class="form-control phone-mask"
            placeholder="+1 (609) 988-44-11"
            aria-label="john.doe@example.com"
            name="userContact"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="parent-role">Parent Role</label>
          <select id="parent-role" class="form-select" @change="onParentRoleChange">
            <option value="">Select Parent Role</option>
            <option
              v-for="role in newUserModalStore.parentRoles"
              :key="role.role_id"
              :value="role.role_id"
            >
              {{ role.role_name }}
            </option>
          </select>
        </div>
        <div class="mb-6">
          <label class="form-label" for="user-role">User Role</label>
          <select id="user-role" class="form-select">
            <option value="" disabled selected>Select User Role</option>
            <option
              v-for="role in newUserModalStore.filteredUserRoles"
              :key="role.role_id"
              :value="role.role_id"
            >
              {{ role.role_name }}
            </option>
          </select>
        </div>
        <div class="mb-6" v-if="newUserModalStore.companies.length > 0">
          <label class="form-label" for="add-user-company">Company</label>
          <select id="add-user-company" class="form-select">
            <option value="">Select Company</option>
            <option
              v-for="company in newUserModalStore.companies"
              :key="company.id"
              :value="company.id"
            >
              {{ company.name }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary me-3 data-submit">Add User</button>
        <button type="reset" class="btn btn-label-danger" data-bs-dismiss="offcanvas">
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
