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
      console.log('Parent Role ID:', parentRoleId)
      this.newUserModalStore.filterUserRoles(parentRoleId)
      await this.newUserModalStore.fetchCompanies(parentRoleId)
      console.log('Filtered User Roles:', this.newUserModalStore.filteredUserRoles)
      console.log('Fetched Companies:', this.newUserModalStore.companies)
    },
    async onSubmit(event) {
      event.preventDefault()
      const form = event.target
      const userData = {
        email: form.userEmail.value,
        phone_number: form.userContact.value,
        password: form.userPassword.value,
        first_name: form.userfirstname.value,
        last_name: form.userlastname.value,
        role_id: form.userRole.value,
        status: form.userStatus.value,
      }

      try {
        const registerResponse = await this.newUserModalStore.registerUser(userData)
        const userId = registerResponse.data ? registerResponse.data.user_id : null
        if (!userId) {
          throw new Error('User ID not found in registration response')
        }
        const companyId = form.addUserCompany ? form.addUserCompany.value : null
        const roleId = form.userRole.value
        const status = form.userStatus.value
        const parentRoleId = form.parentRole.value

        await this.newUserModalStore.assignUserToRole(
          userId,
          companyId,
          roleId,
          status,
          parentRoleId,
        )
        alert('User added successfully')
      } catch (error) {
        console.error('Error adding user:', error)
        alert('Error adding user')
      }
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
      <form class="add-new-user pt-0" id="addNewUserForm" @submit="onSubmit">
        <div class="mb-6">
          <label class="form-label" for="add-user-firstname">First Name</label>
          <input
            type="text"
            class="form-control"
            id="add-user-firstname"
            placeholder="John"
            name="userfirstname"
            aria-label="John"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="add-user-lastname">Last Name</label>
          <input
            type="text"
            class="form-control"
            id="add-user-lastname"
            placeholder="Doe"
            name="userlastname"
            aria-label="Doe"
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
          <label class="form-label" for="add-user-password">Password</label>
          <input
            type="password"
            id="add-user-password"
            class="form-control"
            placeholder="Password"
            name="userPassword"
          />
        </div>
        <div class="mb-6">
          <label class="form-label" for="parent-role">Parent Role</label>
          <select
            id="parent-role"
            class="form-select"
            name="parentRole"
            @change="onParentRoleChange"
          >
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
          <select id="user-role" class="form-select" name="userRole">
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
        <div
          class="mb-6"
          v-if="newUserModalStore.companies && newUserModalStore.companies.length > 0"
        >
          <label class="form-label" for="add-user-company">Company</label>
          <select id="add-user-company" class="form-select" name="addUserCompany">
            <option value="">Select Company</option>
            <option
              v-for="company in newUserModalStore.companies"
              :key="company.id"
              :value="company.id"
            >
              {{
                company.company_name ||
                company.merchant_name ||
                company.agency_name ||
                company.name ||
                company.b2b_name
              }}
            </option>
          </select>
        </div>
        <div class="mb-6">
          <label class="form-label" for="user-status">Status</label>
          <select id="user-status" class="form-select" name="userStatus">
            <option value="pending">Pending</option>
            <option value="reject">Reject</option>
            <option value="approved">Approved</option>
            <option value="hold">Hold</option>
            <option value="warning">Warning</option>
            <option value="suspend">Suspend</option>
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
