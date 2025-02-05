<script>
import AddRoleModal from '@/components/role/AddRoleModal.vue'
import EditRoleModal from '@/components/role/EditRoleModal.vue'
import { Modal } from 'bootstrap'
import { useToast } from 'vue-toastification'
import { useRolesListStore } from '../../stores/role/RoleStore.js'

export default {
  name: 'RolesList',
  components: {
    AddRoleModal,
    EditRoleModal,
  },
  data() {
    return {
      selectedRoleId: null,
      editRoleModalRef: null,
    }
  },
  setup() {
    const rolesListStore = useRolesListStore()
    const toast = useToast()
    rolesListStore.fetchRoles()

    return { rolesListStore, toast }
  },
  computed: {
    groupedRoles() {
      const roles = this.rolesListStore.getAllRoles
      const grouped = roles.reduce((acc, role) => {
        if (!role.parent_id) {
          acc[role.role_id] = { ...role, subRoles: [] }
        } else {
          if (!acc[role.parent_id]) {
            acc[role.parent_id] = { subRoles: [] }
          }
          acc[role.parent_id].subRoles.push(role)
        }
        return acc
      }, {})
      return Object.values(grouped)
    },
  },
  methods: {
    initializeEditRoleModal(selector, action) {
      const modalElement = document.getElementById(selector)
      const roleModalAction = Modal.getInstance(modalElement) || new Modal(modalElement)
      if (action === 'hide') {
        roleModalAction.hide()
        return
      }
      roleModalAction.show()
    },
    openEditModal(roleId) {
      this.selectedRoleId = roleId
      this.$nextTick(() => {
        this.initializeEditRoleModal('editRoleModal', 'show')
      })
    },
    async deleteRole(roleId) {
      if (confirm('Are you sure you want to delete this role?')) {
        const rolesListStore = useRolesListStore()
        try {
          await rolesListStore.deleteRole(roleId)
          this.toast.success('Role deleted successfully')
        } catch (error) {
          this.toast.error('Error deleting role')
          console.error('Error deleting role:', error)
        }
      }
    },
  },
}
</script>

<template>
  <h4 class="mb-1">Roles List</h4>

  <div class="row mb-6">
    <div class="col-md-8">
      <p>
        A role provided access to predefined menus and features so that depending on <br />
        assigned role an administrator can have access to what user needs.
      </p>
    </div>
    <div class="col-md-4 text-end">
      <button
        class="btn btn-secondary btn-primary waves-effect waves-light rounded border-left-0 border-right-0"
        tabindex="0"
        aria-controls="DataTables_Table_0"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#addRoleModal"
      >
        <span
          ><i class="ti ti-plus ti-xs me-md-2"></i
          ><span class="d-md-inline-block d-none">Add new role</span></span
        >
      </button>
    </div>
  </div>
  <!-- Role cards -->
  <div class="row g-6">
    <div v-for="role in groupedRoles" :key="role.role_id" class="col-xl-12">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <p class="role_id">#{{ role.role_id }}</p>
            <h6 class="fw-normal mb-0 text-body">Total {{ role.user_count }} users</h6>
            <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
              <li
                v-for="user in role.users || []"
                :key="user.user_id"
                data-bs-toggle="tooltip"
                data-popup="tooltip-custom"
                data-bs-placement="top"
                :title="user.name"
                class="avatar pull-up"
              >
                <img class="rounded-circle" :src="user.avatar" alt="Avatar" />
              </li>
            </ul>
          </div>
          <div class="d-flex justify-content-between align-items-end">
            <div class="role-heading">
              <h5 class="mb-1">{{ role.role_name }}</h5>
              <a href="javascript:;" @click="openEditModal(role.role_id)" class="role-edit-modal"
                ><span>Edit Role</span></a
              >
            </div>
            <a href="javascript:void(0);" @click="deleteRole(role.role_id)">
              <i class="ti ti-trash ti-md ti-md text-heading"></i>
            </a>
          </div>
          <div v-if="role.subRoles.length" class="sub-roles mt-3 row">
            <div v-for="subRole in role.subRoles" :key="subRole.role_id" class="card mt-2 col-md-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <p class="role_id">#{{ subRole.role_id }}</p>
                  <h6 class="fw-normal mb-0 text-body">Total {{ subRole.user_count }} users</h6>
                  <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                    <li
                      v-for="user in subRole.users || []"
                      :key="user.user_id"
                      data-bs-toggle="tooltip"
                      data-popup="tooltip-custom"
                      data-bs-placement="top"
                      :title="user.name"
                      class="avatar pull-up"
                    >
                      <img class="rounded-circle" :src="user.avatar" alt="Avatar" />
                    </li>
                  </ul>
                </div>
                <div class="d-flex justify-content-between align-items-end">
                  <div class="role-heading">
                    <h5 class="mb-1">{{ subRole.role_name }}</h5>
                    <a
                      href="javascript:;"
                      @click="openEditModal(subRole.role_id)"
                      class="role-edit-modal"
                      ><span>Edit Role</span></a
                    >
                  </div>
                  <a href="javascript:void(0);" @click="deleteRole(subRole.role_id)">
                    <i class="ti ti-trash ti-md ti-md text-heading"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-4 col-lg-6 col-md-6">
      <div class="card h-100">
        <div class="row h-100">
          <div class="col-sm-5">
            <div class="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-4">
              <img
                src="../../frontend/assets/img/illustrations/add-new-roles.png"
                class="img-fluid mt-sm-4 mt-md-0"
                alt="add-new-roles"
                width="83"
              />
            </div>
          </div>
          <div class="col-sm-7">
            <div class="card-body text-sm-end text-center ps-sm-0">
              <button
                data-bs-target="#addRoleModal"
                data-bs-toggle="modal"
                class="btn btn-sm btn-primary mb-4 text-nowrap add-new-role"
              >
                Add New Role
              </button>
              <p class="mb-0">
                Add new role, <br />
                if it doesn't exist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--/ Role cards -->

  <!-- Add Role Modal -->
  <AddRoleModal @modal-open="initializeEditRoleModal('addRoleModal', action)" />
  <!-- Edit Role Modal -->
  <EditRoleModal
    v-if="selectedRoleId"
    :roleId="selectedRoleId"
    @modal-open="initializeEditRoleModal('editRoleModal', action)"
  />
</template>

<style>
.role_id {
  position: absolute;
  font-size: 50px;
  top: 0;
  right: 10px;
  opacity: 0.1;
}
.sub-roles {
  margin: 0 10px;
}
</style>
