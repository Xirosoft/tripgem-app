<script>
import { useRolesListStore } from '../../stores/role/roles.js'
export default {
  name: 'RolesList',
  setup() {
    const rolesListStore = useRolesListStore()
    rolesListStore.fetchRoles()

    return { rolesListStore }
  },
}
</script>

<template>
  <h4 class="mb-1">Roles List</h4>

  <p class="mb-6">
    A role provided access to predefined menus and features so that depending on <br />
    assigned role an administrator can have access to what user needs.
  </p>
  <!-- Role cards -->
  <div class="row g-6">
    <div
      v-for="role in rolesListStore.getAllRoles"
      :key="role.role_id"
      class="col-xl-4 col-lg-6 col-md-6"
    >
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h6 class="fw-normal mb-0 text-body">
              Total {{ rolesListStore.getUserCount(role.role_id) }} users {{ role.role_id }}
            </h6>
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
              <a
                href="javascript:;"
                data-bs-toggle="modal"
                data-bs-target="#addRoleModal"
                class="role-edit-modal"
                ><span>Edit Role</span></a
              >
            </div>
            <a href="javascript:void(0);"><i class="ti ti-trash ti-md ti-md text-heading"></i></a>
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
                src="../../assets/img/illustrations/add-new-roles.png"
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

  <!--/ Add Role Modal -->
</template>
