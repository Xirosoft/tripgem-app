<script>
import { usePermissionStore } from '../../stores/permission/PermissionStore.js'

export default {
  name: 'AddPermissionModal',
  data() {
    return {
      permissionName: '',
      permissionDescription: '',
      isCorePermission: false,
      isLoading: false,
      message: '',
      messageType: '',
    }
  },
  methods: {
    async addPermission() {
      this.isLoading = true
      this.message = ''
      const payload = {
        permission_name: this.permissionName,
        description: this.permissionDescription,
        core: this.isCorePermission,
      }
      const permissionStore = usePermissionStore()
      try {
        await permissionStore.addPermission(payload)
        if (!permissionStore.error) {
          this.message = 'Permission created successfully'
          this.messageType = 'success'
          // Optionally, close the modal
          // this.$refs.addPermissionModal.hide()
          // Update the permission list
          await permissionStore.fetchPermissions()
        } else {
          this.message = permissionStore.error
          this.messageType = 'danger'
        }
      } catch (error) {
        this.message = 'Error adding permission'
        this.messageType = 'danger'
        console.error('Error adding permission:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>

<template>
  <div
    class="modal fade"
    id="addPermissionModal"
    tabindex="-1"
    aria-hidden="true"
    ref="addPermissionModal"
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
            <h4 class="mb-2">Add New Permission</h4>
            <p>Permissions you may use and assign to your users.</p>
          </div>
          <form id="addPermissionForm" class="row" @submit.prevent="addPermission">
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionName">Permission Name</label>
              <input
                type="text"
                id="modalPermissionName"
                name="modalPermissionName"
                class="form-control"
                v-model="permissionName"
                placeholder="Permission Name"
                autofocus
              />
            </div>
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionDescription">Description</label>
              <textarea
                id="modalPermissionDescription"
                name="modalPermissionDescription"
                class="form-control"
                v-model="permissionDescription"
                placeholder="Permission Description"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12 text-center demo-vertical-spacing">
              <button type="submit" class="btn btn-primary me-4" :disabled="isLoading">
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Create Permission
              </button>
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
          <div v-if="message" :class="`alert alert-${messageType} mt-4`" role="alert">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
