<script>
export default {
  data() {
    return {
      permissions: [],
    }
  },
  created() {
    this.fetchPermissions()
  },
  methods: {
    async fetchPermissions() {
      const response = await fetch('/wp-json/tripgem/v1/permissions/view')
      const data = await response.json()
      this.permissions = data.data
    },
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
  <div class="modal fade" id="addPermissionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-simple">
      <div class="modal-content">
        <div class="modal-body">
          <button
            type="button"
            class="btn-close btn-pinned"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="text-center mb-6">
            <h4 class="mb-2">Add New Permission</h4>
            <p>Permissions you may use and assign to your users.</p>
          </div>
          <form id="addPermissionForm" class="row" onsubmit="return false">
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionName">Permission Name</label>
              <input
                type="text"
                id="modalPermissionName"
                name="modalPermissionName"
                class="form-control"
                placeholder="Permission Name"
                autofocus
              />
            </div>
            <div class="col-12 mb-2">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="corePermission" />
                <label class="form-check-label" for="corePermission">
                  Set as core permission
                </label>
              </div>
            </div>
            <div class="col-12 text-center demo-vertical-spacing">
              <button type="submit" class="btn btn-primary me-4">Create Permission</button>
              <button
                type="reset"
                class="btn btn-label-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!--/ Add Permission Modal -->

  <!-- Edit Permission Modal -->
  <div class="modal fade" id="editPermissionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-simple">
      <div class="modal-content">
        <div class="modal-body">
          <button
            type="button"
            class="btn-close btn-pinned"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="text-center mb-6">
            <h4 class="mb-2">Edit Permission</h4>
            <p>Edit permission as per your requirements.</p>
          </div>
          <div class="alert alert-warning d-flex align-items-start" role="alert">
            <span class="alert-icon me-4 rounded-2"
              ><i class="ti ti-alert-triangle ti-md"></i
            ></span>
            <span>
              <span class="alert-heading mb-1 h5">Warning</span><br />
              <span class="mb-0 p"
                >By editing the permission name, you might break the system permissions
                functionality. Please ensure you're absolutely certain before proceeding.</span
              >
            </span>
          </div>
          <form id="editPermissionForm" class="row pt-2 row-gap-2 gx-4" onsubmit="return false">
            <div class="col-sm-9">
              <label class="form-label" for="editPermissionName">Permission Name</label>
              <input
                type="text"
                id="editPermissionName"
                name="editPermissionName"
                class="form-control"
                placeholder="Permission Name"
                tabindex="-1"
              />
            </div>
            <div class="col-sm-3 mb-4">
              <label class="form-label invisible d-none d-sm-inline-block">Button</label>
              <button type="submit" class="btn btn-primary mt-1 mt-sm-0">Update</button>
            </div>
            <div class="col-12">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="editCorePermission" />
                <label class="form-check-label" for="editCorePermission">
                  Set as core permission
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!--/ Edit Permission Modal -->

  <!-- /Modal -->
</template>
