<script>
export default {
  name: 'EditPermissionModal',
  mounted() {
    // Initialize offcanvas
    // const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasAddUser'))
    // offcanvas.hide()
  },
}
</script>

<template>
  <div
    class="modal fade"
    id="editPermissionModal"
    tabindex="-1"
    aria-hidden="true"
    ref="editPermissionModal"
  >
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
            <div class="col-sm-12">
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
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionDescription">Description</label>
              <textarea
                id="modalPermissionDescription"
                name="modalPermissionDescription"
                class="form-control"
                placeholder="Permission Description"
                rows="3"
              ></textarea>
            </div>
            <div class="col-sm-3 mb-4">
              <label class="form-label invisible d-none d-sm-inline-block">Button</label>
              <button type="submit" class="btn btn-primary mt-1 mt-sm-0">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
