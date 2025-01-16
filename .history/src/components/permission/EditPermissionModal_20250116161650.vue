<script>
import { usePermissionStore } from '../../stores/permission/PermissionStore.js'

export default {
  name: 'EditPermissionModal',
  props: {
    permission: Object,
  },
  data() {
    return {
      permissionName: this.permission.permission_name,
      permissionDescription: this.permission.description,
      isLoading: false,
      message: '',
      messageType: '',
    }
  },
  methods: {
    async editPermission() {
      this.isLoading = true
      this.message = ''
      const payload = {
        permission_name: this.permissionName,
        description: this.permissionDescription,
      }
      const permissionStore = usePermissionStore()
      try {
        await permissionStore.editPermission(this.permission.permission_id, payload)
        if (!permissionStore.error) {
          this.message = 'Permission updated successfully'
          this.messageType = 'success'
          // Optionally, close the modal
          // this.$refs.editPermissionModal.hide()
          // Update the permission list
          await permissionStore.fetchPermissions()
        } else {
          this.message = permissionStore.error
          this.messageType = 'danger'
        }
      } catch (error) {
        this.message = 'Error updating permission'
        this.messageType = 'danger'
        console.error('Error updating permission:', error)
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
            <p>Update the details of the permission.</p>
          </div>
          <form id="editPermissionForm" class="row" @submit.prevent="editPermission">
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
                Update Permission
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
