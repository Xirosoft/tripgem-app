<script>
import AddPermission from '@/components/permission/AddPermission.vue'
import EditPermission from '@/components/permission/EditPermission.vue'
import { usePermissionStore } from '../../stores/permission/PermissinList.js'
export default {
  name: 'PermissionsList',
  components: {
    AddPermission,
    EditPermission,
  },
  setup() {
    const permissionStore = usePermissionStore()
    permissionStore.fetchPermissions()
    return { permissionStore }
  },
}
</script>
<template>
  <!-- Permission Table -->
  <div class="card">
    <div class="card-datatable table-responsive">
      <table class="datatables-permissions table border-top">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Assigned To</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
  <!--/ Permission Table -->

  <!-- Modal -->
  <!-- Add Permission Modal -->
  <AddPermission />
  <!--/ Add Permission Modal -->

  <!-- Edit Permission Modal -->
  <EditPermission />
  <!--/ Edit Permission Modal -->

  <!-- /Modal -->
</template>
